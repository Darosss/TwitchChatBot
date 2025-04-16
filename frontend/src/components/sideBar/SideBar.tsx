import { useEffect, useMemo, useState } from "react";

import { Link, LinkProps, useLocation } from "react-router-dom";
import { resetWindowScroll } from "@utils";
import { useGetAuthorizeUrl } from "@services";
import DrawerBar from "@components/drawer";
import { routes } from "@routes";
import ChangeTheme from "@components/changeTheme";
import { useSocketContext } from "@socket";
import DiscordInviteButton from "./DiscordInviteButton";

interface NavLinkProps extends LinkProps {
  label: string;
}

export default function SideBar() {
  const {
    data: authData,
    error,
    refetch: refetchAuthorizeUrl,
  } = useGetAuthorizeUrl();
  const {
    emits: { logout: emitLogout },
    events: { sendLoggedUserInfo },
  } = useSocketContext();

  const [loggedUser, setLoggedUser] = useState<string>("");

  const handleOnLogoutButton = () => {
    emitLogout();
  };

  useEffect(() => {
    if (!sendLoggedUserInfo) return;

    sendLoggedUserInfo.on((username) => {
      setLoggedUser(username);
    });

    return () => {
      sendLoggedUserInfo.off();
    };
  }, [sendLoggedUserInfo]);

  return (
    <DrawerBar direction={"right"} size={"15vw"} overlay={true}>
      <ul className="sidebar-ul">
        <li>
          <ChangeTheme />
        </li>
        {routes.map((route, index) => (
          <NavLink key={index} to={route.path} label={route.label} />
        ))}

        {loggedUser ? (
          <>
            <li>
              <button
                className="common-button danger-button"
                onClick={() => handleOnLogoutButton()}
              >
                Logout
              </button>
            </li>
            <li>
              <button className="common-button logged-button">
                Logged as: <span>{loggedUser}</span>
              </button>
            </li>
          </>
        ) : error || !authData ? (
          <li>
            <button
              className="common-button tertiary-button"
              onClick={() => {
                refetchAuthorizeUrl();
              }}
            >
              Refresh Link
            </button>
          </li>
        ) : (
          <li>
            <a
              className="common-button tertiary-button"
              href={authData ? authData.data : "_blank"}
              target="_blank"
              rel="noreferrer"
            >
              Connect with twitch
            </a>
          </li>
        )}
        <li>
          <DiscordInviteButton />
        </li>
      </ul>
    </DrawerBar>
  );
}

const NavLink = ({ label, ...restProps }: NavLinkProps) => {
  const location = useLocation();
  function handleClick() {
    resetWindowScroll();
  }

  const isUserOnThisSite = useMemo(() => {
    const restPropsToString = restProps.to.toString();
    return (
      restPropsToString.length > 1 &&
      location.pathname.includes(restPropsToString)
    );
  }, [restProps.to, location.pathname]);

  return (
    <li>
      <Link
        {...restProps}
        className={`common-button ${
          isUserOnThisSite ? "secondary-button" : "primary-button"
        }`}
        onClick={handleClick}
      >
        {label}
      </Link>
    </li>
  );
};
