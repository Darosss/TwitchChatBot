import "./style.css";
import React from "react";
import { Link } from "react-router-dom";
import resetWindowScroll from "@utils/resetScroll";
import useAxios from "axios-hooks";

export default function SideBar() {
  const [{ data, loading, error }] = useAxios<string>("auth/authorize-url");

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
          <Link onClick={resetWindowScroll} to="/configs">
            Configs
          </Link>
        </li>
        <li>
          <a className="connect-twitch" href={data ? data : "_blank"}>
            {error ? "URL Error" : "Connect with twitch"}
          </a>
        </li>
      </ul>
    </div>
  );
}
