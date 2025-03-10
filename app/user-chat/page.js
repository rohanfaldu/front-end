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
                <div className="containerr">
                    <div className="row">
                    <section className="discussions" style={{position: "relative"}}>
                        {discussions.map((user) => (
                            <div
                                key={user.id}
                                className={`discussion ${activeUser === user.id ? "message-active" : ""}`}
                                onClick={() => setActiveUser(user.id)}
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
                    </div>
                </div>
            </ChatAdmin>
        </>
    );
}
