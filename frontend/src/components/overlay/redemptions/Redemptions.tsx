import React, { useEffect, useRef, useState } from "react";

import { useSocketContext } from "@context/socket";

export default function Redemptions() {
  const {
    events: { onRedemption },
  } = useSocketContext();
  const redemptionRef = useRef<HTMLDivElement>(null);

  const [redemptionInfo, setRedemptionInfo] = useState("");
  const [redemptionImg, setRedemptionImg] = useState("");
  const [showRedemption, setShowRedemption] = useState(false);

  useEffect(() => {
    let source: AudioBufferSourceNode | null = null;

    onRedemption.on((data, audioBuffer) => {
      const { rewardTitle, userDisplayName, rewardImage } = data;

      setRedemptionImg(rewardImage);
      setRedemptionInfo(`${userDisplayName} has redeemed - ${rewardTitle}`);
      setShowRedemption(true);

      const audioCtx = new AudioContext();
      audioCtx.decodeAudioData(audioBuffer, (buffer) => {
        if (source) {
          source.stop();
        }

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
            setShowRedemption(false);
          };
      });
    });

    return () => {
      onRedemption.off();
    };
  }, [onRedemption]);

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
