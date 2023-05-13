import React, { useContext, useEffect, useRef, useState } from "react";

import { SocketContext } from "@context/socket";

export default function Redemptions() {
  const socket = useContext(SocketContext);
  const redemptionRef = useRef<HTMLDivElement>(null);

  const [redemptionInfo, setRedemptionInfo] = useState("");
  const [redemptionImg, setRedemptionImg] = useState("");
  const [showRedemption, setShowRedemption] = useState(false);

  useEffect(() => {
    let source: AudioBufferSourceNode | null = null;

    socket.on("onRedemption", (data, audioBuffer) => {
      const { rewardTitle, userDisplayName, rewardImage } = data;

      setRedemptionImg(rewardImage);
      setRedemptionInfo(`${userDisplayName} has redeemed - ${rewardTitle}`);
      setShowRedemption(true);

      const audioCtx = new AudioContext();
      audioCtx.decodeAudioData(audioBuffer, (buffer) => {
        if (source) {
          console.log("SOURCE ALREADY IS SO STOP ");
          source.stop();
        }

        console.log("Create new source ");
        source = new AudioBufferSourceNode(audioCtx, {
          buffer: buffer,
        });

        const gainNode = audioCtx.createGain();
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.gain.value = 0.12;

        source.start();

        if (source)
          source.onended = function () {
            console.log("ended");
            setShowRedemption(false);
          };
      });
    });

    return () => {
      socket.off("onRedemption");
    };
  }, [socket]);

  if (showRedemption)
    return (
      <div ref={redemptionRef} className="redemption-wrapper">
        <div>
          {redemptionImg ? (
            <img
              alt="no"
              src={redemptionImg}
              style={{
                width: (redemptionRef.current?.offsetWidth || 200) / 12,
              }}
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
  else {
    return <></>;
  }
}
