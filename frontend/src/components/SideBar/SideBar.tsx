import "./style.css";
import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import TwitchChat from "../TwitchChat";
import Users from "../Users";
import Overlay from "../Overlay";
import MessagesList from "../MessagesList";
import UserProfile from "../UserProfile";
import resetWindowScroll from "../../utils/resetScroll";
import TwitchSessions from "../TwitchSessions/";
import RedemptionsList from "../RedemptionsList";
import useAxios from "axios-hooks";

export default function SideBar() {
  const [{ data, loading, error }] = useAxios<string>("/twitch-authorize-url");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (!data) return <>Something went wrong!</>;

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
            <a href={data}>{error ? "URL Error" : "Login to twitch"}</a>
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
      </Routes>
    </BrowserRouter>
  );
}
