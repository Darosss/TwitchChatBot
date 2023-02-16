import "./style.css";
import React from "react";
import { Link } from "react-router-dom";
import resetWindowScroll from "@utils/resetScroll";
import AuthService from "src/services/Auth.service";

export default function SideBar() {
  const { data: authData, loading, error } = AuthService.getAuthorizeUrl();
  if (error) return <>Error!</>;
  if (loading) return <>Loading...</>;

  return (
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
          <Link onClick={resetWindowScroll} to="/commands">
            Commands
          </Link>
        </li>
        <li>
          <Link onClick={resetWindowScroll} to="/triggers">
            Triggers
          </Link>
        </li>
        <li>
          <Link onClick={resetWindowScroll} to="/configs">
            Configs
          </Link>
        </li>
        <li>
          <a className="connect-twitch" href={authData ? authData : "_blank"}>
            {error ? "URL Error" : "Connect with twitch"}
          </a>
        </li>
      </ul>
    </div>
  );
}
