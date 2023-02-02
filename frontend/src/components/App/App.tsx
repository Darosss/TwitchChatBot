import "./style.css";
import React, { useRef } from "react";

import { SocketContext, socketConn } from "@context/SocketContext";
import SideBar from "@components/SideBar";

import { configure } from "axios-hooks";
import Axios from "axios";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import TwitchChat from "@components/TwitchChat";
import Users from "@components/Users";
import Overlay from "@components/Overlay";
import MessagesList from "@components/MessagesList";
import UserProfile from "@components/UserProfile";
import TwitchSessions from "@components/TwitchSessions/";
import RedemptionsList from "@components/RedemptionsList";
import CommandsList from "@components/CommandsList";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

configure({ axios });

function App() {
  const main = useRef<HTMLDivElement | null>(null);

  return (
    <SocketContext.Provider value={socketConn}>
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <SideBar mainDiv={main} />
          </header>
        </div>
        <div className="main" ref={main}>
          <Routes>
            <Route path="/" element={<Overlay />}></Route>

            <Route
              path="/messages"
              element={<MessagesList messages="all" />}
            ></Route>
            <Route path="/twitch-sessions" element={<TwitchSessions />}></Route>
            <Route
              path="/messages/:userId"
              element={<MessagesList messages="user" />}
            ></Route>
            <Route
              path="/messages/twitch-session/:sessionId"
              element={<MessagesList messages="session" />}
            ></Route>
            <Route
              path="/redemptions"
              element={<RedemptionsList messages="all" />}
            ></Route>
            <Route
              path="/redemptions/:userId"
              element={<RedemptionsList messages="user" />}
            ></Route>
            <Route
              path="/redemptions/twitch-session/:sessionId"
              element={<RedemptionsList messages="session" />}
            ></Route>
            <Route path="/user/:userId" element={<UserProfile />}></Route>
            <Route path="/users" element={<Users />}></Route>
            <Route path="/chat" element={<TwitchChat />}></Route>

            <Route path="/commands" element={<CommandsList />}></Route>
            <Route
              path="/commands/:commandId"
              element={<CommandsList />}
            ></Route>
            <Route path="/configs" element={<>Configs</>}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
