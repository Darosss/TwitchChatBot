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
  const [wrapperStyle, setWrapperStyle] = React.useState<React.CSSProperties>();
  const [btnStyle, setBtnStyle] = React.useState<React.CSSProperties>();
  const [btnText, setBtnText] = React.useState<string>();
  const [drawerClass, setDrawerClass] = React.useState("");
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    switch (direction) {
      case "bottom":
        setWrapperStyle({ top: "95%", width: "100%" });
        setBtnStyle({ width: "100%" });
        setBtnText("\u2191");
        setDrawerClass("drawer-horizontal");
        break;
      case "left":
        setWrapperStyle({ height: "100%" });
        setBtnStyle({ height: "100%" });
        setBtnText("\u2192");
        setDrawerClass("drawer-vertical");
        break;
      case "right":
        setWrapperStyle({ right: "0", height: "100%" });
        setBtnStyle({ height: "100%" });
        setBtnText("\u2190");
        setDrawerClass("drawer-vertical");
        break;
      case "top":
        setWrapperStyle({ top: "-1%", width: "100%" });
        setBtnStyle({ width: "100%" });
        setBtnText("\u2193");
        setDrawerClass("drawer-horizontal");
        break;
    }
  }, [direction]);

  return (
    <div className="btn-drawer-wrapper" style={wrapperStyle}>
      <button className="btn-drawer" style={btnStyle} onClick={toggleDrawer}>
        {btnText}
      </button>
      <Drawer
        direction={direction ? direction : "right"}
        open={isOpen}
        onClose={toggleDrawer}
        size={size ? size : 250}
        enableOverlay={overlay}
        className={`${drawerClass}`}
        style={{
          background: "#18181b",
          position: isOpen && sticky ? "sticky" : "absolute",
          overflow: "hidden",
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
    </div>
  );
}
