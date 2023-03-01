import "./style.css";
import React from "react";

import { Link, LinkProps } from "react-router-dom";
import resetWindowScroll from "@utils/resetScroll";
import AuthService from "src/services/AuthService";

interface INavLinkProps extends LinkProps {
  label: string;
}

export default function SideBar() {
  const { data: authData, loading, error } = AuthService.getAuthorizeUrl();
  if (error) return <>Error!</>;
  if (loading) return <>Loading...</>;

  return (
    <div className="navbar">
      <ul>
        {routes.map((route) => {
          return (
            <NavLink key={route.path} to={route.path} label={route.label} />
          );
        })}

        <li>
          <a
            className="connect-twitch"
            href={authData ? authData.data : "_blank"}
          >
            {error ? "URL Error" : "Connect with twitch"}
          </a>
        </li>
      </ul>
    </div>
  );
}

const routes = [
  { path: "/", label: "Home" },
  { path: "/overlay", label: "Overlay" },
  { path: "/messages", label: "Messages" },
  { path: "/users", label: "Users" },
  { path: "/events", label: "Events" },
  { path: "/stream-sessions", label: "Sessions" },
  { path: "/redemptions", label: "Redemptions" },
  { path: "/commands", label: "Commands" },
  { path: "/triggers", label: "Triggers" },
  { path: "/configs", label: "Configs" },
];

const NavLink = ({ label, ...restProps }: INavLinkProps) => {
  function handleClick() {
    resetWindowScroll();
  }

  return (
    <li>
      <Link {...restProps} onClick={handleClick}>
        {label}
      </Link>
    </li>
  );
};
