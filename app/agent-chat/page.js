'use client';

import React, { useEffect, useState } from 'react';
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import Head from "next/head";
import ChatAdmin from '@/components/layout/chatMain';
import "font-awesome/css/font-awesome.min.css";
import EmojiPicker from "emoji-picker-react";
<Head>
    {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" /> */}
    {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat" /> */}
    {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" /> */}
</Head>


export default function Chat() {

    const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");

  // Handle emoji selection
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

  const selectUser = (id, name) => {
    setActiveUser(id);
    setShowMessage(true);
    setSelectedUser(name);
  };
  const selectProperty = (id, name) => {
    setActiveProperty(id);
    setSelectClick(true);
    setSelectedProperty(name);
  };

  const resetData = () => {
      setActiveUser(null);
      setActiveProperty(null);
      setSelectClick(false);
      setShowMessage(false);
      setSelectedUser("");
      setSelectedProperty("");

  }
  const property = [
    {
        id: 1,
        name: "3 BHK flat for sale",
        price: "6000",
        date: "15-03-2025",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    },
    {
        id: 2,
        name: "350 small flat for sale",
        price: "2045",
        date: "16-03-2025",
        image: "http://e0.365dm.com/16/08/16-9/20/theirry-henry-sky-sports-pundit_3766131.jpg?20161212144602",
    },
    {
        id: 3,
        name: "2 BHK flat for sale",
        price: "7777",
        date: "17-03-2025",
        image: "https://images.unsplash.com/photo-1497551060073-4c5ab6435f12?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=667&q=80",
    },
    {
        id: 4,
        name: "2 BHK flat for rent",
        price: "5000",
        date: "18-03-2025",
        image: "http://thomasdaubenton.xyz/portfolio/images/photo.jpg",
    },
    {
        id: 5,
        name: "5 BHK flat for sale",
        price: "2000",
        date: "19-03-2025",
        image: "http://thomasdaubenton.xyz/portfolio/images/photo.jpg",
    },
    {
        id: 6,
        name: "6 BHK flat for sale",
        price: "1500",
        date: "20-03-2025",
        image: "http://thomasdaubenton.xyz/portfolio/images/photo.jpg",
    },
    {
        id: 7,
        name: "5 BHK flat for rent",
        price: "500",
        date: "21-03-2025",
        image: "http://thomasdaubenton.xyz/portfolio/images/photo.jpg",
    },
];

    const discussions = [
        {
            id: 1,
            name: "Megan Leib",
            message: "9 pm at the bar if possible 😳",
            time: "12 sec",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        },
        {
            id: 2,
            name: "Dave Corlew",
            message: "Let's meet for a coffee or something today ?",
            time: "3 min",
            image: "http://e0.365dm.com/16/08/16-9/20/theirry-henry-sky-sports-pundit_3766131.jpg?20161212144602",
        },
        {
            id: 3,
            name: "Jerome Seiber",
            message: "I've sent you the annual report",
            time: "42 min",
            image: "https://images.unsplash.com/photo-1497551060073-4c5ab6435f12?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=667&q=80",
        },
        {
            id: 4,
            name: "Thomas Dbtn",
            message: "See you tomorrow ! 🙂",
            time: "2 hour",
            image: "http://thomasdaubenton.xyz/portfolio/images/photo.jpg",
        },
        {
            id: 5,
            name: "Deven Sureja",
            message: "Hello! 🙂",
            time: "2 hour",
            image: "http://thomasdaubenton.xyz/portfolio/images/photo.jpg",
        },
        {
            id: 6,
            name: "Rohan Patel",
            message: "Sound Good ! 🙂",
            time: "2 hour",
            image: "http://thomasdaubenton.xyz/portfolio/images/photo.jpg",
        },
        {
            id: 7,
            name: "Testing User",
            message: "I am bot! 🙂",
            time: "2 hour",
            image: "http://thomasdaubenton.xyz/portfolio/images/photo.jpg",
        },
    ];

    return (
        <>
        <ChatAdmin>
            <div style={{fontSize: "22px", fontWeight: "600", padding: "20px", display: "flex"}}>
                <div>
                    <span>Chat Review</span> 
                </div>
                <div onClick={() => resetData()} style={{cursor: "pointer"}}>
                    {selectedProperty !== '' && 
                        <span> &gt;&gt; <span style={{color: "#0dcaf0"}}> {selectedProperty} </span></span> 
                    }
                </div>
                {/* {selectedUser !== '' && 
                    <span> &gt;&gt; {selectedUser}</span>
                } */}
            </div>
            <div className="containerr">
                <div className="row">
                <section className={`discussions ${selectClick ? "fade-in" : "fade-out"}`}>
                    {discussions.map((user) => (
                        <div
                            key={user.id}
                            className={`discussion ${activeUser === user.id ? "message-active" : ""}`}
                            onClick={() => selectUser(user.id, user.name)}
                        >
                            <div
                                className="photo"
                                style={{ backgroundImage: `url('${user.image}')` }}
                            >
                                <div className="online"></div>
                            </div>
                            <div className="desc-contact">
                                <p className="name">{user.name}</p>
                                <p className="message">{user.message}</p>
                            </div>
                            <div className="timer">{user.time}</div>
                        </div>
                    ))}
                </section>

                <section className={`discussions ${!selectClick ? "fade-in" : "fade-out"}`}>
                    {property.map((property) => (
                        <div
                            key={property.id}
                            className={`discussion ${activeProperty === property.id ? "message-active" : ""}`}
                            onClick={() => selectProperty(property.id, property.name)}
                        >
                            <div
                                className="photo"
                                style={{ backgroundImage: `url('${property.image}')` }}
                            >
                                <div className="online"></div>
                            </div>
                            <div className="desc-contact">
                                <p className="name">{property.name}</p>
                                <p className="message">Price - {property.price}</p>
                            </div>
                            <div className="timer">{property.date}</div>
                        </div>
                    ))}
                </section>

            {showMessage && 
                <section className="chat">
                    <div className="header-chat">
                    <i className="icon fa fa-user-o" aria-hidden="true"></i>
                    <p className="name">Megan Leib</p>
                    <i className="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
                    </div>
                    <div className="messages-chat">
                    <div className="message">
                        <div className="photo"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')",
                        }}>
                        <div className="online"></div>
                        </div>
                        <p className="text"> Hi, how are you ? </p>
                    </div>
                    <div className="message text-only">
                        <p className="text"> What are you doing tonight ? Want to go take a drink ?</p>
                    </div>
                    <p className="time"> 14h58</p>
                    <div className="message text-only">
                        <div className="response">
                        <p className="text"> Hey Megan ! It's been a while 😃</p>
                        </div>
                    </div>
                    <div className="message text-only">
                        <div className="response">
                        <p className="text"> When can we meet ?</p>
                        </div>
                    </div>
                    <p className="response-time time"> 15h04</p>
                    <div className="message">
                        <div className="photo"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')",
                        }}>
                        <div className="online"></div>
                        </div>
                        <p className="text"> 9 pm at the bar if possible 😳</p>
                    </div>
                    <p className="time"> 15h09</p>
                    </div>
                    <div className="footer-chat" style={{ position: "relative" }}>
                        {/* Smiley Icon */}
                        <i
                            className="icon fa fa-smile-o clickable"
                            style={{ fontSize: "25pt", cursor: "pointer" }}
                            onClick={() => setShowPicker(prev => !prev)} // Toggle emoji picker
                            aria-hidden="true"
                        ></i>

                        {/* Emoji Picker (Only shown when `showPicker` is true) */}
                        {showPicker && (
                            <div style={{ position: "absolute", bottom: "50px", left: "10px", zIndex: 1000 }}>
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}

                        {/* Message Input */}
                        <input
                            type="text"
                            className="write-message"
                            placeholder="Type your message here"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ width: "85%" }}
                        />

                        {/* Send Icon */}
                        <i className="icon send fa fa-paper-plane-o clickable" aria-hidden="true"></i>
                        </div>
                </section>
            }
                </div>
            </div>
            </ChatAdmin>
        </>
    );
}
