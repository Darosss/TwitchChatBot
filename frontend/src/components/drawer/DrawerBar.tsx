import "./style.css";
import React, { useEffect } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

export default function DrawerBar(props: {
  children?: React.ReactNode;
  direction: "left" | "right" | "top" | "bottom";
  size?: string | number;
  sticky?: boolean;
  overlay?: boolean;
}) {
  const { children, direction, size, sticky, overlay } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const [btnStyle, setBtnStyle] = React.useState<React.CSSProperties>();
  const [btnText, setBtnText] = React.useState<string>();

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    switch (direction) {
      case "bottom":
        setBtnStyle({ top: "95%", width: "100%" });
        setBtnText("\u2191");
        break;
      case "left":
        setBtnStyle({ height: "100%" });
        setBtnText("\u2192");
        break;
      case "right":
        setBtnStyle({ right: "0", height: "100%" });
        setBtnText("\u2190");
        break;
      case "top":
        setBtnStyle({ width: "100%" });
        setBtnText("\u2193");
        break;
    }
  }, [direction]);

  return (
    <>
      <button className="btn-drawer" style={btnStyle} onClick={toggleDrawer}>
        {btnText}
      </button>
      <Drawer
        direction={direction ? direction : "right"}
        open={isOpen}
        onClose={toggleDrawer}
        size={size ? size : 250}
        enableOverlay={overlay}
        style={{
          background: "#18181b",
          position: isOpen && sticky ? "sticky" : "absolute",
          overflow: "auto",
          display: isOpen ? "block" : "none",
        }}
      >
        <div className="drawer-children-wrapper">
          <button
            className="btn-drawer-close"
            style={btnStyle}
            onClick={toggleDrawer}
          >
            X
          </button>
          {children}
        </div>
      </Drawer>
    </>
  );
}
