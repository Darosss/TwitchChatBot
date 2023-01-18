import "./style.css";
import React, { useContext, useEffect } from "react";
import { SocketContext } from "../../Context/SocketContext";

export default function Overlay() {
  const socket = useContext(SocketContext);

  return <>"Overlay"</>;
}
