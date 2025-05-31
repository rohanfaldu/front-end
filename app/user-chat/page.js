'use client';

import React, { useEffect, useState } from 'react';
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import Head from "next/head";
import ChatAdmin from '@/components/layout/chatMain';
import "font-awesome/css/font-awesome.min.css";
import EmojiPicker from "emoji-picker-react";
import { getFirestore, collection, getDocs, doc, query, where, addDoc, serverTimestamp, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from '@/components/layout/firebaseConfig';
import Preloader from '@/components/elements/Preloader';
import { useRouter } from 'next/navigation';
import { useTranslation } from "react-i18next";
import { InitialAvatar, checkImageUrl } from "@/components/common/Functions.js";
export default function Chat() {
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allRecord, setAllRecord] = useState([]);
  const [chatmessages, setChatmessages] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentImage, setAgentImage] = useState("");
  const [showChatList, setShowChatList] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyName, setPropertyName] = useState("");

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  const router = useRouter();
  const [activeUser, setActiveUser] = useState(null);
  const [chatWithName, setChatWithName] = useState("");
  const { t, i18n } = useTranslation();

  const handleBackToChats = () => {
    setShowChatList(true);
    setActiveUser(null);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeUser) return;

    setIsLoading(true);

    try {
      const userId = localStorage.getItem("user_id");
      const activeChat = allRecord.find(chat => chat.id === activeUser);
      const receiverId = activeChat?.developer_id || activeChat?.agency_id;

      const newMessage = {
        chat: message.trim(),
        datetime: serverTimestamp(),
        from: userId,
        to: receiverId
      };

      const chatCollectionRef = collection(db, "test_chat_new", activeUser, "chat");
      await addDoc(chatCollectionRef, newMessage);

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getMessageWithAgent = async (id, name, image, propertyName) => {
    setActiveUser(id);
    setChatWithName(name);
    setAgentImage(image);
    setShowChatList(false);
    setupChatListener(id);
    setPropertyName(propertyName);
  };

  const setupChatListener = (chatId) => {
    if (!chatId) return;

    try {
      const chatCollectionRef = collection(db, "test_chat_new", chatId, "chat");
      const q = query(chatCollectionRef, orderBy("datetime"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const formattedMessages = formatMessages(chatMessages);
        setChatmessages(formattedMessages);
      }, (error) => {
        console.error("Error in real-time listener:", error);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up chat listener:", error);
    }
  };

  const formatMessages = (chatmessages) => {
    let groupedMessages = [];
    let lastTimestamp = null;
    let currentGroup = [];

    chatmessages.forEach((msg) => {
      if (msg.datetime && typeof msg.datetime.seconds === 'number') {
        const currentTimestamp = new Date(msg.datetime.seconds * 1000)
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        if (currentTimestamp !== lastTimestamp) {
          if (currentGroup.length > 0) {
            groupedMessages.push({ messages: currentGroup, timestamp: lastTimestamp });
            currentGroup = [];
          }
          lastTimestamp = currentTimestamp;
        }

        currentGroup.push(msg);
      }
    });

    if (currentGroup.length > 0) {
      groupedMessages.push({ messages: currentGroup, timestamp: lastTimestamp });
    }

    return groupedMessages;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffHours = Math.abs(now - date) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString();
  };

  const filteredRecords = allRecord.filter(user =>
    user.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.developer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.agency_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    async function fetchChatData() {
      try {
        const storedDeveloperId_or_AgencyId = localStorage.getItem("user_id");
        const userRole = localStorage.getItem("role");

        if (!storedDeveloperId_or_AgencyId) {
          console.warn("No Developer/Agency ID found.");
          return;
        }

        if (userRole === "user") {
          const chatCollectionRef = collection(db, "test_chat_new");
          const q = query(chatCollectionRef, where("user_id", "==", storedDeveloperId_or_AgencyId));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.warn(`No chats found for Developer ID: ${storedDeveloperId_or_AgencyId}`);
            return;
          }

          const chatRecords = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const recordsWithLastMessages = await Promise.all(chatRecords.map(async (chat) => {
            const messagesRef = collection(db, `test_chat_new/${chat.id}/chat`);
            const messagesQuery = query(messagesRef, orderBy("datetime", "desc"), limit(1));
            const messageSnapshot = await getDocs(messagesQuery);

            if (!messageSnapshot.empty) {
              const latestMessage = messageSnapshot.docs[0].data();
              return {
                ...chat,
                lastMessage: {
                  text: latestMessage.chat || latestMessage.text || "No text content",
                  timestamp: latestMessage.datetime
                }
              };
            }

            return chat;
          }));

          setAllRecord(recordsWithLastMessages);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    }

    fetchChatData();

    return () => {
      // Cleanup listeners
    };
  }, []);

  useEffect(() => {
    if (activeUser) {
      return setupChatListener(activeUser);
    }
  }, [activeUser]);

  // console.log('Validate URl:', checkImageUrl(agentImage));
  // console.log('Current state:', agentImage);
  return (
    <>
      <ChatAdmin>
        {loading && <Preloader />}
        {!loading && (
          <div className="modern-chat-container">
            {/* Chat List Sidebar */}
            <div className={`chat-sidebar ${showChatList ? 'show' : 'hide-mobile'}`}>
              {/* Header */}
              <div className="sidebar-header">
                <div className="header-title">
                  <h2>Messages</h2>
                  <span className="message-count">{allRecord.length}</span>
                </div>
                <div className="header-actions">
                  <button className="header-btn">
                    <i className="fa fa-bars"></i>
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="search-container">
                <div className="search-input-wrapper">
                  {/* <i className="fa fa-search search-icon"></i> */}
                  <input
                    type="text"
                    placeholder="Search"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="chat-list">
                {console.log(filteredRecords, "filteredRecords")}
                {filteredRecords.map((user) => (
                  <div
                    key={user.id}
                    className={`chat-item ${activeUser === user.id ? "active" : ""}`}
                    onClick={() => getMessageWithAgent(
                      user.id,
                      user.agency_name !== '' ? user.agency_name : user.developer_name,
                      user.agency_image !== '' ? user.agency_image : user.developer_image,
                      user.property_name !== '' ? user.property_name : ""
                    )}
                  >
                    <div className="chat-avatar">
                      {(user.agency_image || user.developer_image) && (
                        <img
                          src={user.agency_image !== '' && user.developer_image === ''
                            ? user.agency_image
                            : user.developer_image !== '' && user.agency_image === ''
                              ? user.developer_image
                              : null}
                          alt="Avatar"
                          className="avatar-image"
                        />
                      )}
                      <div className="online-status">
                        <img src="/images/chat/chat-online.svg" alt="chat-Online" />
                      </div>
                    </div>

                    <div className="chat-content">
                      <div className="chat-header">
                        <h4 className="chat-name">
                          {user.agency_name !== '' ? user.agency_name : user.developer_name}
                        </h4>
                        <span className="chat-time">
                          {formatTime(user.lastMessage?.timestamp)}
                        </span>
                      </div>
                      <div className="chat-preview">
                        <p className="property-title">{user.property_name}</p>
                        <p className="last-message-text">
                          {user.lastMessage?.text || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              {/* <div className="sidebar-footer">
                <button className="footer-btn" onClick={() => router.back()}>
                  <i className="fa fa-sign-out"></i>
                  <span>LogOut</span>
                </button>
                <button className="footer-btn">
                  <i className="fa fa-cog"></i>
                  <span>Settings</span>
                </button>
              </div> */}
            </div>

            {/* Chat Area */}
            <div className={`chat-main ${!showChatList ? 'show-mobile' : ''}`}>
              {activeUser ? (
                <>
                  {/* Chat Header */}
                  <div className="chat-header">
                    <button
                      className="mobile-back"
                      onClick={handleBackToChats}
                    >
                      <i className="fa fa-arrow-left"></i>
                    </button>

                    <div className="chat-user user-bar-sec">
                      <img
                        src={agentImage || '/default-avatar.png'}
                        alt="User"
                        className="user-avatar"
                      />
                      <div className="user-info">
                        <div className="user-name-sec">
                           <h3 className="user-name">{chatWithName}</h3>
                          <p className="property-title">{propertyName}</p>
                        </div>
                        <div className="user-status-sec">
                          {/* <span className="user-status">Active Yesterday ago</span> */}
                        </div>
                      </div>
                    </div>

                    {/* <div className="chat-actions">
                      <button className="action-btn">
                        <i className="fa fa-phone"></i>
                      </button>
                      <button className="action-btn">
                        <i className="fa fa-video-camera"></i>
                      </button>
                      <button className="action-btn">
                        <i className="fa fa-info-circle"></i>
                      </button>
                      <button className="action-btn">
                        <i className="fa fa-ellipsis-h"></i>
                      </button>
                    </div> */}
                  </div>

                  {/* Messages */}
                  <div className="messages-area">
                    {chatmessages.map((group, index) => (
                      <div key={index} className="message-group">
                        {group.messages.map((msg, idx) => (
                          <div key={msg.id} className={`message ${msg.from === localStorage.getItem("user_id") ? 'sent' : 'received'}`}>

                            {msg.from !== localStorage.getItem("user_id") && (
                              <>
                                <InitialAvatar fullName={chatWithName} />
                              </>
                            )}
                            <div className="message-bubble">
                              <p>{msg.chat}</p>
                            </div>
                            {msg.from === localStorage.getItem("user_id") && (
                              <img src={agentImage} alt="You" className="message-avatar" />
                            )}
                          </div>
                        ))}
                        <div className="message-time">
                          <span>{group.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="message-input-area">
                    <div className="input-container">
                      <button className="input-action" onClick={() => setShowPicker(!showPicker)}>
                        <i className="fa fa-smile-o"></i>
                      </button>
                      {/* <button className="input-action">
                        <i className="fa fa-paperclip"></i>
                      </button>
                      <button className="input-action">
                        <i className="fa fa-user"></i>
                      </button>
                      <button className="input-action">
                        <i className="fa fa-microphone"></i>
                      </button> */}

                      <input
                        type="text"
                        placeholder="Your Message..."
                        className="message-input"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={!activeUser || isLoading}
                      />

                      <button
                        className="send-button"
                        onClick={handleSendMessage}
                        disabled={!activeUser || isLoading}
                      >
                        <i className="fa fa-paper-plane"></i>
                      </button>
                    </div>

                    {showPicker && (
                      <div className="emoji-picker">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="no-chat">
                  <div className="no-chat-content">
                    <i className="fa fa-comments-o"></i>
                    <h3>Select a chat to start messaging</h3>
                    <p>Choose from your existing conversations or start a new one</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </ChatAdmin>
    </>
  );
}