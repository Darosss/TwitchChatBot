import "./style.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../Context/SocketContext";

export default function Overlay() {
  const socket = useContext(SocketContext);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [redemptionInfo, setRedemptionInfo] = useState("");
  const [redemptionImg, setRedemptionImg] = useState("");
  useEffect(() => {
    socket?.on("playRedemptionSound", (data) => {
      const { rewardTitle, userDisplayName, rewardImage } = data;
      if (rewardTitle.includes("Alert sound")) {
        setRedemptionImg(rewardImage?.url_4x);
        setRedemptionInfo(`${userDisplayName} has redeemed - ${rewardTitle}`);
        overlayRef.current?.classList.remove("overlay-hidden");

        const audiotest = new Audio(
          `/alert-sounds/${rewardTitle.split(":")[1].trim()}.mp3`
        );
        audiotest.volume = 0.03;
        audiotest.play();

        audiotest.addEventListener("ended", function () {
          overlayRef.current?.classList.add("overlay-hidden");
        });
      }
    });

    return () => {
      socket.off("playRedemptionSound");
    };
  }, [socket]);

  return (
    <>
      <div ref={overlayRef} id="overlay-redemption" className="overlay-hidden">
        {redemptionInfo}
        {redemptionImg ? <img alt="no" src={redemptionImg} /> : null}
      </div>
    </>
  );
}
