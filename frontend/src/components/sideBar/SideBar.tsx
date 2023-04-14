import React from "react";

import { Link, LinkProps } from "react-router-dom";
import resetWindowScroll from "@utils/resetScroll";
import { getAuthorizeUrl } from "@services/AuthService";
import DrawerBar from "@components/drawer";

interface NavLinkProps extends LinkProps {
  label: string;
}

export default function SideBar(props: {
  theme: string;
  handleThemeChange: () => void;
}) {
  const { theme, handleThemeChange } = props;
  const { data: authData, error } = getAuthorizeUrl();

  return (
    <DrawerBar direction={"right"} size={"15vw"} overlay={true}>
      <ul className="sidebar-ul">
        <li>
          <button
            className={`common-button ${
              theme === "light" ? "secondary-button" : "primary-button"
            }`}
            onClick={handleThemeChange}
          >
            {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          </button>
        </li>
        {routes.map((route) => {
          return (
            <NavLink key={route.path} to={route.path} label={route.label} />
          );
        })}

        <li>
          <a
            className="connect-twitch"
            href={authData ? authData.data : "_blank"}
            target="_blank"
            rel="noreferrer"
          >
            {error ? "URL Error" : "Connect with twitch"}
          </a>
        </li>
      </ul>
    </DrawerBar>
  );
}

const routes = [
  { path: "/", label: "Home" },
  { path: "/overlay", label: "Overlay" },
  { path: "/messages", label: "Messages" },
  { path: "/message-categories", label: "Message categories" },
  { path: "/users", label: "Users" },
  { path: "/events", label: "Events" },
  { path: "/modes", label: "Modes" },
  { path: "/stream-sessions", label: "Sessions" },
  { path: "/redemptions", label: "Redemptions" },
  { path: "/commands", label: "Commands" },
  { path: "/triggers", label: "Triggers" },
  { path: "/timers", label: "Timers" },
  { path: "/configs", label: "Configs" },
];

const NavLink = ({ label, ...restProps }: NavLinkProps) => {
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
