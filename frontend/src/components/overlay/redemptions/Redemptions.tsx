import React, { useContext, useEffect, useRef, useState } from "react";

import { SocketContext } from "@context/SocketContext";

export default function Redemptions() {
  const socket = useContext(SocketContext);
  const redemptionRef = useRef<HTMLDivElement>(null);

  const [redemptionInfo, setRedemptionInfo] = useState("");
  const [redemptionImg, setRedemptionImg] = useState("");

  useEffect(() => {
    socket?.on("onRedemption", (data) => {
      const { rewardTitle, userDisplayName, rewardImage } = data;

      let redemptionAudio: HTMLAudioElement;

      setRedemptionImg(rewardImage);
      setRedemptionInfo(`${userDisplayName} has redeemed - ${rewardTitle}`);
      redemptionRef.current?.classList.remove("redemption-popup-hidden");

      setTimeout(() => {
        redemptionAudio?.pause();
        redemptionRef.current?.classList.add("overlay-hidden");
        setRedemptionImg("");
        setRedemptionInfo("");
      }, Number(import.meta.env.VITE_REDEMPTION_ALERT_MAX_TIME!) * 1000);

      if (rewardTitle.includes(import.meta.env.VITE_PREFIX_ALERT_SOUND!)) {
        const redemptionAudio = new Audio(
          `/alertSounds/${rewardTitle.split(":")[1].trim()}.mp3`
        );
        redemptionAudio.volume = 0.03;
        redemptionAudio.play();
      }
    });

    return () => {
      socket.off("onRedemption");
    };
  }, [socket]);

  return (
    <div ref={redemptionRef} className="redemption-wrapper">
      <div>
        {redemptionImg ? (
          <img
            alt="no"
            src={redemptionImg}
            style={{ width: (redemptionRef.current?.offsetWidth || 200) / 12 }}
          />
        ) : null}
      </div>
      <div
        className="redemption-popup"
        style={{ fontSize: (redemptionRef.current?.offsetWidth || 200) / 24 }}
      >
        {redemptionInfo}
      </div>
    </div>
  );
}
