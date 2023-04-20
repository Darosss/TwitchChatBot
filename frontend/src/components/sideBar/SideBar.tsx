import React from "react";

import { Link, LinkProps } from "react-router-dom";
import resetWindowScroll from "@utils/resetScroll";
import { getAuthorizeUrl } from "@services/AuthService";
import DrawerBar from "@components/drawer";
import { routes } from "@routes/routesList";
import ChangeTheme from "@components/changeTheme";

interface NavLinkProps extends LinkProps {
  label: string;
}

export default function SideBar() {
  const { data: authData, error } = getAuthorizeUrl();

  return (
    <DrawerBar direction={"right"} size={"15vw"} overlay={true}>
      <ul className="sidebar-ul">
        <li>
          <ChangeTheme />
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
