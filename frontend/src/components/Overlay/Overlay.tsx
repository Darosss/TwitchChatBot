import "./style.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../Context/SocketContext";

export default function Overlay() {
  const socket = useContext(SocketContext);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [redemptionInfo, setRedemptionInfo] = useState("");
  const [redemptionImg, setRedemptionImg] = useState("");
  useEffect(() => {
    socket?.on("onRedemption", (data) => {
      const { rewardTitle, userDisplayName, rewardImage } = data;

      let redemptionAudio: HTMLAudioElement;

      setRedemptionImg(rewardImage?.url_4x);
      setRedemptionInfo(`${userDisplayName} has redeemed - ${rewardTitle}`);
      overlayRef.current?.classList.remove("overlay-hidden");

      setTimeout(() => {
        redemptionAudio?.pause();
        overlayRef.current?.classList.add("overlay-hidden");
      }, Number(process.env.REACT_APP_REDEMPTION_ALERT_MAX_TIME!) * 1000);

      if (rewardTitle.includes(process.env.REACT_APP_PREFIX_ALERT_SOUND!)) {
        const redemptionAudio = new Audio(
          `/alert-sounds/${rewardTitle.split(":")[1].trim()}.mp3`
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
    <>
      <div ref={overlayRef} id="overlay-redemption" className="overlay-hidden">
        {redemptionInfo}
        {redemptionImg ? <img alt="no" src={redemptionImg} /> : null}
      </div>
    </>
  );
}
