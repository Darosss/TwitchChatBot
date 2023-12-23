import ChangeTheme from "@components/changeTheme";
import { HelmetTitle } from "@components/componentWithTitle";
import Message, { MessageProps } from "@components/message";
import { routes } from "@routes";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const chatMessages = [
  "WELCOME HOME!",
  "Wassup, bro?",
  "How's goin...",
  "Nice weather today, don't you think so?",
  "Hope you all right",
  "Go and check your triggers :D",
  "I have feeling that timers today will be happier",
  "I hope you all right!",
];

export default function Home() {
  return (
    <div className="home-wrapper">
      <HelmetTitle title="Home" />
      <div className="home-nav">
        <h1> Twitch ChatBot </h1>
        <ChangeTheme />
      </div>
      <div className="home-content">
        <div className="home-content-tiles">
          {routes.map((route, index) =>
            route.path !== "/" ? (
              <div key={index} className="tile-wrapper">
                <div className="tile-description">
                  <Link to={route.path}>
                    {" "}
                    <pre>{route.description}</pre>{" "}
                  </Link>
                </div>
                <div className="common-button primary-button">
                  {route.label}
                </div>
              </div>
            ) : null
          )}
        </div>
        <ChatBackground />
      </div>
      <div className="home-footer">
        <div>Footer</div>
        <div>Footer</div>
        <div>Footer</div>
      </div>
    </div>
  );
}

function ChatBackground() {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    let chatTimeout: NodeJS.Timeout;
    let chatMessageIndex = 1;

    const getRandomDelay = () => {
      const min = 500;
      const max = 1000;
      const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;
      return randomDelay;
    };

    const getRandomFromChatMessages = () => {
      return chatMessages[Math.floor(Math.random() * chatMessages.length)];
    };

    const timeoutChatMessage = () => {
      chatTimeout = setTimeout(() => {
        if (chatMessageIndex > 100) return;
        chatMessageIndex++;
        setMessages((prevState) => {
          prevState.push({
            date: new Date(),
            username: `Chat bot`,
            message: getRandomFromChatMessages(),
          });
          return [...prevState];
        });
        timeoutChatMessage();
      }, chatMessageIndex * getRandomDelay());
    };

    timeoutChatMessage();

    return () => clearTimeout(chatTimeout);
  }, []);

  return (
    <div className="home-chat-bg prevent-select">
      {messages.map((message, index) => (
        <div key={index} className="typewriter">
          <Message
            date={message.date}
            username={message.username}
            message={message.message}
            tooltip={false}
          />
        </div>
      ))}
    </div>
  );
}
