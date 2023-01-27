import "./style.css";
import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import TwitchChat from "../TwitchChat";
import Users from "../Users";
import Overlay from "../Overlay";
import MessagesList from "../MessagesList";
import useFetch from "../../hooks/useFetch.hook";
import UserProfile from "../UserProfile";
import resetWindowScroll from "../../utils/resetScroll";
import TwitchSessions from "../TwitchSessions/";

export default function SideBar() {
  const { data: authUrlRes, error: authUrlError } = useFetch<string>(
    process.env.REACT_APP_BACKEND_URL + "/twitch-authorize-url"
  );

  return (
    <BrowserRouter>
      <div className="navbar">
        <ul>
          <li>
            <Link onClick={resetWindowScroll} to="/">
              Overlay
            </Link>
          </li>
          <li>
            <Link onClick={resetWindowScroll} to="/messages">
              Messages
            </Link>
          </li>
          <li>
            <Link onClick={resetWindowScroll} to="/users">
              Users
            </Link>
          </li>
          <li>
            <Link onClick={resetWindowScroll} to="/chat">
              Chat
            </Link>
          </li>
          <li>
            <Link onClick={resetWindowScroll} to="/twitch-sessions">
              Sessions
            </Link>
          </li>
          <li>
            <Link onClick={resetWindowScroll} to="/redemptions">
              Redemptions
            </Link>
          </li>
          <li>
            <a href={authUrlRes}>
              {authUrlError ? "URL Error" : "Login to twitch"}
            </a>
          </li>
        </ul>
      </div>
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
        <Route path="/redemptions" element={<>all redemptions</>}></Route>
        <Route
          path="/redemptions/:userId"
          element={<> userid redemptions</>}
        ></Route>
        <Route
          path="/redemptions/twitch-session/:sessionId"
          element={<>session id redemptions</>}
        ></Route>
        <Route path="/user/:userId" element={<UserProfile />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/chat" element={<TwitchChat />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
