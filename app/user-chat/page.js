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


export default function Chat() {
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allRecord, setAllRecord] = useState([]);
  const [chatmessages, setChatmessages] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentImage, setAgentImage] = useState();
  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowPicker(false);
  };
  const router = useRouter();
  const [activeUser, setActiveUser] = useState(null);
  const [chatWithName, setChatWithName] = useState("");


  const handleSendMessage = async () => {
    if (!message.trim() || !activeUser) return;
    
    setIsLoading(true);
    
    try {
      const userId = localStorage.getItem("user_id");
      // Find the receiver ID from the active chat record
      const activeChat = allRecord.find(chat => chat.id === activeUser);
      const receiverId = activeChat?.developer_id || activeChat?.agency_id;
      
      // Create a new message object
      const newMessage = {
        chat: message.trim(),
        datetime: serverTimestamp(),
        from: userId,
        to: receiverId
      };
      
      // Add the message to the Firestore collection
      const chatCollectionRef = collection(db, "chat_new", activeUser, "chat");
      await addDoc(chatCollectionRef, newMessage);
      
      // Clear the input field
      setMessage("");
      
      // We don't need to fetch messages here anymore since we have a real-time listener
      
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


  const getMessageWithAgent = async (id, name, image) => {
    setActiveUser(id);
    setChatWithName(name);
    setAgentImage(image);
    console.log("SelectedImage:", image);
    // Set up real-time listener for the selected chat
    setupChatListener(id);
  };
  
  // This function sets up a real-time listener for chat messages
  const setupChatListener = (chatId) => {
    if (!chatId) return;
    
    try {
      const chatCollectionRef = collection(db, "chat_new", chatId, "chat");
      // Create a query that orders messages by datetime
      const q = query(chatCollectionRef, orderBy("datetime"));
      
      // Set up the real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Format and update messages
        const formattedMessages = formatMessages(chatMessages);
        setChatmessages(formattedMessages);
        console.log("Real-time chat messages updated:", chatMessages);
      }, (error) => {
        console.error("Error in real-time listener:", error);
      });
      
      // Clean up the listener when component unmounts or chat changes
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
      // Check if datetime is a Firestore timestamp object
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
        
  useEffect(() => {
    async function fetchChatData() {
      try {
        const storedDeveloperId_or_AgencyId = localStorage.getItem("user_id");
        const userRole = localStorage.getItem("role");
  
        if (!storedDeveloperId_or_AgencyId) {
          console.warn("No Developer/Agency ID found.");
          return;
        }
  
        if(userRole === "user") {
          const chatCollectionRef = collection(db, "chat_new");
          const q = query(chatCollectionRef, where("user_id", "==", storedDeveloperId_or_AgencyId));
          const querySnapshot = await getDocs(q);
  
          if (querySnapshot.empty) {
            console.warn(`No chats found for Developer ID: ${storedDeveloperId_or_AgencyId}`);
            return;
          }
          
          // Get basic chat info
          const chatRecords = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          // Fetch the latest message for each chat
          const recordsWithLastMessages = await Promise.all(chatRecords.map(async (chat) => {
            // Reference the messages subcollection for this chat
            const messagesRef = collection(db, `chat_new/${chat.id}/chat`);
            // Query to get the latest message (ordered by datetime)
            const messagesQuery = query(messagesRef, orderBy("datetime", "desc"), limit(1));
            const messageSnapshot = await getDocs(messagesQuery);
            
            if (!messageSnapshot.empty) {
              const latestMessage = messageSnapshot.docs[0].data();
              // Update the lastMessage field with the actual last message
              return {
                ...chat,
                lastMessage: {
                  text: latestMessage.chat || latestMessage.text || "No text content",
                  timestamp: latestMessage.datetime
                }
              };
            }
            
            return chat; // Return original chat if no messages found
          }));
  
          setAllRecord(recordsWithLastMessages);
          
          // If there are chats, automatically select the first one
          if (recordsWithLastMessages.length > 0) {
            getMessageWithAgent(
              recordsWithLastMessages[0].id, 
              recordsWithLastMessages[0].agency_name !== '' 
                ? recordsWithLastMessages[0].agency_name 
                : recordsWithLastMessages[0].developer_name,
              recordsWithLastMessages[0].agency_image !== '' 
                ? recordsWithLastMessages[0].agency_image 
                : recordsWithLastMessages[0].developer_image
            );
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    }
    
    fetchChatData();
    
    // Clean up any listeners when component unmounts
    return () => {
      // If we had stored the unsubscribe function, we would call it here
    };
  }, []);

  // Effect to set up or clean up chat listener when activeUser changes
  useEffect(() => {
    if (activeUser) {
      return setupChatListener(activeUser);
    }
  }, [activeUser]);


  return (
    <>
      <ChatAdmin>
        {loading &&
            <Preloader />
        }
        {!loading &&
          <div className="containerr">
            <div className="link back-btn chat-back">
								<button
									className="form-wg tf-btn primary"
									type="button"
									style={{ margin: "10px" }}
									onClick={() => router.back()}
								>
									<span style={{ color: "#fff" }}>&lt;</span>
								</button>
							</div>
            <div className="row">
              <section className="discussions" style={{position: "relative"}}>
                {allRecord.map((user) => (
                  <div
                    key={user.id}
                    className={`discussion ${activeUser === user.id ? "message-active" : ""}`}
                    onClick={() => getMessageWithAgent(user.id, user.agency_name !== '' ? user.agency_name : user.developer_name, user.agency_image !== '' ? user.agency_image : user.developer_image)}
                  >
                    <div
                      className="photo"
                      style={{ backgroundImage: `url('${user.property_image}')` }}
                    >
                      <div className="online"></div>
                    </div>
                    <div className="desc-contact-2">
                      <p className="name">{user.property_name}</p>
                      {user.developer_name !== '' && 
                        <p className="name">{user.developer_name}</p>
                      }
                      {user.agency_name !== '' && 
                        <p className="name">{user.agency_name}</p>
                      }
                      <p className="message">{user.lastMessage?.text || "No messages yet"}</p>
                    </div>
                    <div className="timer">{user.lastMessage?.timestamp ? new Date(user.lastMessage.timestamp.toDate()).toLocaleDateString() : "No date"}</div>
                  </div>
                ))}
              </section>
              <section className="chat">
                <div className="header-chat">
                  {/* <i className="icon fa fa-user-o" aria-hidden="true"></i> */}
                  <img
                      src={agentImage} style={{width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", marginLeft: "30px"}}
                    />
                  <p className="name">{chatWithName}</p>
                  {/* <i className="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i> */}
                </div>
                <div className="messages-chat">
                  {chatmessages.map((group, index) => (
                    <div key={index}>
                      {group.messages.map((msg, idx) => (
                        <div key={msg.id}>
                          {msg.from !== localStorage.getItem("user_id") && (
                            <div className="message">
                              {/* {(idx === 0 || (idx > 0 && group.messages[idx - 1].from !== localStorage.getItem("user_id"))) && (
                                <div className="photo"
                                  style={{
                                    backgroundImage: "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')",
                                  }}>
                                  <div className="online"></div>
                                </div>
                              )} */}
                              <p className="text">{msg.chat}</p>
                            </div>
                          )}

                          {msg.from === localStorage.getItem("user_id") && (
                            <div className="message text-only">
                              <div className="response">
                                <p className="text"> {msg.chat}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <p className={group.messages[0].from === localStorage.getItem("user_id") ? "response-time time" : "time"}>{group.timestamp}</p>
                    </div>
                  ))}
                </div>


                <div className="footer-chat" style={{ position: "absolute", width: "-webkit-fill-available" }}>
                  <i
                    className="icon fa fa-smile-o clickable"
                    style={{ fontSize: "25pt", cursor: "pointer" }}
                    onClick={() => setShowPicker(prev => !prev)}
                    aria-hidden="true"
                  ></i>
                  {showPicker && (
                    <div style={{ position: "absolute", bottom: "50px", left: "10px", zIndex: 1000 }}>
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                  <input
                    type="text"
                    className="write-message"
                    placeholder="Type your message here"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ width: "85%" }}
                    disabled={!activeUser || isLoading}
                  />

                  <i 
                    className={`icon send fa fa-paper-plane-o clickable ${isLoading ? 'disabled' : ''}`} 
                    aria-hidden="true"
                    onClick={handleSendMessage}
                    style={{ cursor: activeUser && !isLoading ? 'pointer' : 'not-allowed', opacity: activeUser && !isLoading ? 1 : 0.5 }}
                  ></i>
                </div>
              </section>
            </div>
          </div>
        }
      </ChatAdmin>
    </>
  );
}