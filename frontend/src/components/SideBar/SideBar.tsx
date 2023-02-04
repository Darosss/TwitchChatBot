import "./style.css";
import React from "react";
import { Link } from "react-router-dom";
import resetWindowScroll from "@utils/resetScroll";
import useAxios from "axios-hooks";

export default function SideBar() {
  const [{ data, loading, error }] = useAxios<string>("/twitch-authorize-url");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (!data) return <>Something went wrong!</>;

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
          <a href={data}>{error ? "URL Error" : "Login to twitch"}</a>
        </li>
      </ul>
    </div>
  );
}
