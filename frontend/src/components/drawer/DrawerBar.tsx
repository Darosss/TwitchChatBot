import "./style.css";
import React from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

export default function DrawerBar(props: {
  children?: React.ReactNode;
  direction: "left" | "right" | "top" | "bottom";
  size?: string | number;
  showBtnText: string;
}) {
  const { children, direction, size, showBtnText } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  return (
    <>
      <button className="btn-show-drawer" onClick={toggleDrawer}>
        {showBtnText}
      </button>
      <Drawer
        direction={direction ? direction : "right"}
        open={isOpen}
        onClose={toggleDrawer}
        size={size ? size : 250}
        enableOverlay={false}
        style={{ background: "#18181b" }}
      >
        <button className="btn-close-drawer" onClick={toggleDrawer}>
          X
        </button>
        {children}
      </Drawer>
    </>
  );
}
