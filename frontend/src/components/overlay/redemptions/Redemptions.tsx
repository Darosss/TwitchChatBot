import { useEffect, useState } from "react";

import { useSocketContext } from "@socket";
import { getTwitchEmoteUrl, randomWithMax } from "@utils";
import { commonData } from "../commonExampleData";
import { RootStore } from "@redux/store";
import { useSelector } from "react-redux";

export default function Redemptions() {
  const {
    events: { onRedemption },
  } = useSocketContext();

  const {
    isEditor,
    baseData: {
      styles: { overlayRedemptions: styles },
    },
  } = useSelector((state: RootStore) => state.overlays);

  const [redemptionInfo, setRedemptionInfo] = useState("");
  const [redemptionImg, setRedemptionImg] = useState("");
  const [showRedemption, setShowRedemption] = useState(false);

  useEffect(() => {
    if (isEditor) {
      setShowRedemption(true);
      setRedemptionImg(getTwitchEmoteUrl({ id: "25" }));
      setRedemptionInfo(
        `${
          commonData.nicknames[randomWithMax(commonData.nicknames.length - 1)]
        } has redeemed - Reward`
      );
    }
  }, [isEditor]);

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

  if (showRedemption || isEditor)
    return (
      <div
        className="redemption-wrapper"
        style={{
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
        }}
      >
        <div
          className="redemption-background"
          style={{
            background: styles.background,
            filter: `opacity(${styles.opacity}%)`,
          }}
        ></div>
        <div>
          {redemptionImg ? (
            <img
              alt="no"
              src={redemptionImg}
              style={{
                maxWidth: styles.imageSize,
                minWidth: styles.imageSize,
              }}
            />
          ) : null}
        </div>
        <div className="redemption-popup" style={{ fontSize: styles.fontSize }}>
          {redemptionInfo}
        </div>
      </div>
    );
  else {
    return <></>;
  }
}
