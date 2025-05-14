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

export default function Chat() {

  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [propertyCollection, setPropertyCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowPicker(false); // Close the picker after selecting an emoji
  };
  const [activeUser, setActiveUser] = useState(null);
  const [activeProperty, setActiveProperty] = useState(null);
  const [selectClick, setSelectClick] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [allRecord, setAllRecord] = useState([]);
  const [ShowUser, setShowUser] = useState([]);
  const [chatmessages, setChatmessages] = useState([]);
  const [userImage, setUserImage] = useState("");
  const [loading, setLoading] = useState(true);
  // Function to set up real-time chat listener
  const setupChatListener = (chatDocId) => {
    if (!chatDocId) return null;
    
    try {
      const chatCollectionRef = collection(db, "chat_new", chatDocId, "chat");
      // Create a query to order messages by datetime
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
        // console.log("Real-time chat messages updated:", chatMessages);
      }, (error) => {
        console.error("Error in real-time listener:", error);
      });
      
      // Return the unsubscribe function for cleanup
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up chat listener:", error);
      return null;
    }
  };

  const selectUser = async (id, name, image) => {
    setActiveUser(id);
    setShowMessage(true);
    setSelectedUser(name);
    setUserImage(image);

    // Create the chat document ID
    const chatDocId = `${localStorage.getItem("user_id")}_${activeProperty}_${id}`;
    
    // Setup real-time listener for this chat
    return setupChatListener(chatDocId);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeUser || !activeProperty) return;
    
    setIsLoading(true);
    
    try {
      const agentId = localStorage.getItem("user_id");
      const userRole = localStorage.getItem("role");
      
      // Create the document ID in the same format as used in the selectUser function
      const chatDocId = `${agentId}_${activeProperty}_${activeUser}`;
      
      // Create a new message object
      const newMessage = {
        chat: message.trim(),
        datetime: serverTimestamp(),
        from: agentId,
        to: activeUser
      };
      
      // Add the message to the Firestore collection
      const chatCollectionRef = collection(db, "chat_new", chatDocId, "chat");
      await addDoc(chatCollectionRef, newMessage);
      
      // Clear the input field
      setMessage("");
      
      // No need to refresh messages manually as the real-time listener will update automatically
      
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle Enter key press to send messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
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

  const selectProperty = (id, name) => {
    setActiveUser(null); // Reset active user when changing property
    setActiveProperty(id);
    setSelectClick(true);
    const filteredRecords = allRecord.filter(item => item.property_id === id);
    setShowUser(filteredRecords);
    setSelectedProperty(name);
    setChatmessages([]); // Clear current chat messages
    setShowMessage(false); // Hide chat section until a user is selected
  };

  const resetData = () => {
      setActiveUser(null);
      setActiveProperty(null);
      setSelectClick(false);
      setShowMessage(false);
      setSelectedUser("");
      setSelectedProperty("");
      setChatmessages([]);
  }
 
  useEffect(() => {
    async function fetchChatData() {
      try {
        const storedDeveloperId_or_AgencyId = localStorage.getItem("user_id");
        const userRole = localStorage.getItem("role");
  
        if (!storedDeveloperId_or_AgencyId) {
          console.warn("No Developer/Agency ID found.");
          return;
        }
  
        let chatCollectionRef = collection(db, "chat_new");
        let q;
  
        if (userRole === "developer") {
          q = query(chatCollectionRef, where("developer_id", "==", storedDeveloperId_or_AgencyId));
        } else {
          q = query(chatCollectionRef, where("agency_id", "==", storedDeveloperId_or_AgencyId));
        }
  
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          console.warn(`No chats found for ${userRole === "developer" ? "Developer" : "Agency"} ID: ${storedDeveloperId_or_AgencyId}`);
          setLoading(false);
          return;
        }
  
        // Get basic chat records
        let chatRecords = querySnapshot.docs.map((doc) => ({
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
            // console.log(`Latest message for chat ${chat.id}:`, latestMessage);
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
  
        // Process property collections
        const propertyIds = new Set();
        const chatData = [];
        
        recordsWithLastMessages.forEach((item) => {
          if (!propertyIds.has(item.property_id)) {
            propertyIds.add(item.property_id);
            chatData.push(item);
          }
        });
  
        setPropertyCollection(chatData);
        setLoading(false);
        // console.log("Fetched chat data with last messages:", chatData);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    }
  
    fetchChatData();
  }, []);
  
  // Effect to handle active user changes and chat listener setup/cleanup
  useEffect(() => {
    let unsubscribe = null;
    
    if (activeUser && activeProperty) {
      const chatDocId = `${localStorage.getItem("user_id")}_${activeProperty}_${activeUser}`;
      unsubscribe = setupChatListener(chatDocId);
    }
    
    // Cleanup function to unsubscribe when component unmounts or dependencies change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [activeUser, activeProperty]);

  return (
      <>
      <ChatAdmin>
        {loading &&
            <Preloader />
        }
        
          <div style={{fontSize: "22px", fontWeight: "600", padding: "20px", display: "flex"}}>
              <div>
                  <span>Chat Review</span> 
              </div>
              <div onClick={() => resetData()} style={{cursor: "pointer"}}>
                  {selectedProperty !== '' && 
                      <span> &gt;&gt; <span style={{color: "#0dcaf0"}}> {selectedProperty} </span></span> 
                  }
              </div>
          </div>
          {!loading &&
            <div className="containerr">
                <div className="row">
                <section className={`discussions ${selectClick ? "fade-in" : "fade-out"}`}>
                    {ShowUser.map((user) => (
                        <div
                            key={user.user_id}
                            className={`discussion ${activeUser === user.user_id ? "message-active" : ""}`}
                            onClick={() => selectUser(user.user_id, user.user_name, user.user_image)}
                        >
                            <div
                                className="photo"
                                style={{ backgroundImage: `url('${user.user_image}')` }}
                            >
                                <div className="online"></div>
                            </div>
                            <div className="desc-contact">
                                <p className="name">{user.user_name}</p>
                                <p className="message">{user.lastMessage?.text || "No messages yet"}</p>
                            </div>
                            <div className="timer">{user.lastMessage?.timestamp ? 
                                new Date(user.lastMessage.timestamp.toDate()).toLocaleDateString() : 
                                "No date"}</div>
                        </div>
                    ))}
                </section>

                <section className={`discussions ${!selectClick ? "fade-in" : "fade-out"}`}>
                    {propertyCollection.map((property) => (
                        <div
                            key={property.property_id}
                            className={`discussion ${activeProperty === property.property_id ? "message-active" : ""}`}
                            onClick={() => selectProperty(property.property_id, property.property_name)}
                        >
                            <div
                                className="photo"
                                style={{ backgroundImage: `url('${property.property_image}')` }}
                            >
                                <div className="online"></div>
                            </div>
                            <div className="desc-contact">
                                <p className="name">{property.property_name}</p>
                                <p className="message">Price - {property.propertyPrice}</p>
                            </div>
                            <div className="timer">10-03-2025</div>
                        </div>
                    ))}
                </section>

            {showMessage && 
                <section className="chat">
                    <div className="header-chat">
                    {/* <i className="icon fa fa-user-o" aria-hidden="true"></i> */}
                    <img src={userImage} style={{width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", marginLeft: "30px"}}/>
                    <p className="name">{selectedUser}</p>
                    {/* <i className="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i> */}
                    </div>
                    <div className="messages-chat" style={{height: "90%"}}>
                        {chatmessages.map((group, index) => (
                            <div key={index}>
                                {group.messages.map((msg, idx) => (
                                    <div key={msg.id}>
                                        {msg.from === activeUser && (
                                                <div className="message">
                                                    {/* {(idx === 0) && (
                                                        <div className="photo"
                                                            style={{
                                                                backgroundImage: "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')",
                                                            }}>
                                                            <div className="online"></div>
                                                        </div>
                                                    )} */}
                                                    <p className={`text `}>{msg.chat}</p>
                                                </div>
                                            )}


                                        {msg.from !== activeUser && (
                                            <div className="message text-only">
                                                <div className="response">
                                                <p className="text"> {msg.chat}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <p className={group.messages[0].from !== activeUser ? "response-time time" : "time"}>{group.timestamp}</p>
                            </div>
                        ))}
                    </div>

                    <div className="footer-chat" style={{ position: "fixed", width: "-webkit-fill-available" }}>
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
                            disabled={isLoading || !activeUser}
                        />
                        <i 
                            className={`icon send fa fa-paper-plane-o clickable ${isLoading ? 'disabled' : ''}`}
                            aria-hidden="true"
                            onClick={handleSendMessage}
                            style={{ cursor: activeUser && !isLoading ? 'pointer' : 'not-allowed', opacity: activeUser && !isLoading ? 1 : 0.5 }}
                        ></i>
                        </div>
                </section>
            }
                </div>
            </div>
          }
          </ChatAdmin>
      </>
  );
}