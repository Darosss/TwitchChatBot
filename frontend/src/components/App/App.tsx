import "./style.css";
import React from "react";

import { SocketContext, socketConn } from "@context/SocketContext";
import SideBar from "@components/SideBar";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import TwitchEvents from "@components/TwitchEvents";
import Users from "@components/Users";
import Overlay from "@components/Overlay";
import MessagesList from "@components/MessagesList";
import UserProfile from "@components/UserProfile";
import TwitchSessions from "@components/TwitchSessions/";
import RedemptionsList from "@components/RedemptionsList";
import CommandsList from "@components/CommandsList";
import ConfigsList from "@components/ConfigsList";
import TriggersList from "@components/TriggersList";

function App() {
  return (
    <SocketContext.Provider value={socketConn}>
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <SideBar />
          </header>
        </div>

        <div className="main">
          <Routes>
            <Route
              path="/"
              element={
                <div className="main-overlay">
                  <Overlay />
                </div>
              }
            ></Route>
            <Route
              path="messages"
              element={
                <div className="main-other">
                  <MessagesList messages="all" />
                </div>
              }
            ></Route>
            <Route
              path="twitch-sessions"
              element={
                <div className="main-other">
                  <TwitchSessions />
                </div>
              }
            ></Route>
            <Route
              path="twitch-sessions/:sessionId"
              element={
                <div className="main-other">
                  <>TEWTICH SESION </>
                </div>
              }
            ></Route>
            <Route
              path="messages/:userId"
              element={
                <div className="main-other">
                  <MessagesList messages="user" />
                </div>
              }
            ></Route>
            <Route
              path="messages/twitch-session/:sessionId"
              element={
                <div className="main-other">
                  <MessagesList messages="session" />
                </div>
              }
            ></Route>
            <Route
              path="redemptions"
              element={
                <div className="main-other">
                  <RedemptionsList redemptions="all" />
                </div>
              }
            ></Route>
            <Route
              path="redemptions/:userId"
              element={
                <div className="main-other">
                  <RedemptionsList redemptions="user" />
                </div>
              }
            ></Route>
            <Route
              path="redemptions/twitch-session/:sessionId"
              element={
                <div className="main-other">
                  <RedemptionsList redemptions="session" />
                </div>
              }
            ></Route>
            <Route
              path="user/:userId"
              element={
                <div className="main-other">
                  <UserProfile />
                </div>
              }
            ></Route>
            <Route
              path="users"
              element={
                <div className="main-other">
                  <Users />
                </div>
              }
            ></Route>
            <Route
              path="events"
              element={
                <div className="main-other">
                  <TwitchEvents />
                </div>
              }
            ></Route>
            <Route
              path="commands"
              element={
                <div className="main-other">
                  <CommandsList />
                </div>
              }
            ></Route>
            <Route
              path="commands/:commandId"
              element={
                <div className="main-other">
                  <CommandsList />
                </div>
              }
            ></Route>
            <Route
              path="configs"
              element={
                <div className="main-other">
                  <ConfigsList />
                </div>
              }
            ></Route>
            <Route
              path="triggers"
              element={
                <div className="main-other">
                  <TriggersList />
                </div>
              }
            ></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
