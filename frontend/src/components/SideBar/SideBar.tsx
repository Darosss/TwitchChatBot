import "./style.css";
import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import TwitchChat from "../TwitchChat";
import Users from "../Users";
import Overlay from "../Overlay";
import MessagesList from "../MessagesList";

export default function SideBar() {
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
        </ul>
      </div>
      <Routes>
        <Route path="/" element={<Overlay />}></Route>
        <Route path="/messages" element={<MessagesList />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/chat" element={<TwitchChat />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
