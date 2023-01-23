import "./style.css";
import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import TwitchChat from "../TwitchChat";
import Users from "../Users";
import Overlay from "../Overlay";
import MessagesList from "../MessagesList";
import useFetch from "../../hooks/useFetch.hook";
import UserProfile from "../UserProfile";

export default function SideBar() {
  const { data: authUrlRes, error: authUrlError } = useFetch<string>(
    process.env.REACT_APP_BACKEND_URL + "/twitch-authorize-url"
  );

  return (
    <BrowserRouter>
      <div className="navbar">
        <ul>
          <li>
            <Link to="/">Overlay</Link>
          </li>
          <li>
            <Link to="/messages">Messages</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
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
        <Route path="/messages" element={<MessagesList />}></Route>
        <Route path="/messages/:userId" element={<MessagesList />}></Route>
        <Route path="/user/:userId" element={<UserProfile />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/chat" element={<TwitchChat />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
