import "./style.css";
import React from "react";
import { Link } from "react-router-dom";
import resetWindowScroll from "@utils/resetScroll";
import useAxios from "axios-hooks";

export default function SideBar(props: {
  mainDiv: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [{ data, loading, error }] = useAxios<string>("/twitch-authorize-url");

  const { mainDiv } = props;

  const changeMainBackground = (transparent = false) => {
    if (!mainDiv.current) return;

    console.log(transparent);
    if (transparent) mainDiv.current.classList.remove("not-overlay");
    else mainDiv.current.classList.add("not-overlay");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (!data) return <>Something went wrong!</>;

  return (
    <div className="navbar">
      <ul>
        <li>
          <Link
            onClick={() => {
              resetWindowScroll();
              changeMainBackground(true);
            }}
            to="/"
          >
            Overlay
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              resetWindowScroll();
              changeMainBackground();
            }}
            to="/messages"
          >
            Messages
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              resetWindowScroll();
              changeMainBackground();
            }}
            to="/users"
          >
            Users
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              resetWindowScroll();
              changeMainBackground();
            }}
            to="/chat"
          >
            Chat
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              resetWindowScroll();
              changeMainBackground();
            }}
            to="/twitch-sessions"
          >
            Sessions
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              resetWindowScroll();
              changeMainBackground();
            }}
            to="/redemptions"
          >
            Redemptions
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              resetWindowScroll();
              changeMainBackground();
            }}
            to="/commands"
          >
            Commands
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              resetWindowScroll();
              changeMainBackground();
            }}
            to="/configs"
          >
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
