import {
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
  useSocketContext,
} from "@socket";
import { isObtainedAchievement } from "@utils";
import { useEffect, useMemo, useState } from "react";
import { viteBackendUrl } from "@configs/envVariables";
import { getExampleAchievementsData } from "./exampleData";
import { useLocalStorage } from "@hooks";
import { useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { AchievementDataBlock } from "./Data-Blocks";

export type ObtainedAchievementStateType =
  | ObtainAchievementDataWithCollectedAchievement
  | ObtainAchievementDataWithProgressOnly;

const MAX_ACHIEVEMENTS_IN_CACHE = 10;

export default function Achievements() {
  const {
    events: { obtainAchievement, obtainAchievementQueueInfo },
  } = useSocketContext();

  const {
    isEditor,
    baseData: {
      styles: { overlayAchievements: styles },
    },
  } = useSelector((state: RootStore) => state.overlays);

  const [obtainedAchievements, setObtainedAchievements] = useLocalStorage<
    ObtainedAchievementStateType[]
  >("achievementsOverlayData", []);

  const [showAchievementsQueue, setShowAchievementsQueue] = useState(false);
  const [itemsQueLength, setItemsQueLength] = useState(0);

  useEffect(() => {
    const showQueueInterval = setInterval(() => {
      setShowAchievementsQueue(true);

      setTimeout(() => {
        setShowAchievementsQueue(false);
      }, 1000 * 5);
    }, 1000 * 30);

    return () => {
      clearInterval(showQueueInterval);
    };
  }, []);
  useEffect(() => {
    if (isEditor) setObtainedAchievements(getExampleAchievementsData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditor]);

  useEffect(() => {
    const audio = new Audio();
    obtainAchievement.on((data) => {
      setObtainedAchievements((prevState) => [data, ...prevState]);

      const options = {
        audioUrl: "",
        delay: 2500,
      };
      if (isObtainedAchievement(data)) {
        options.audioUrl = data.stage.data.sound || "";
        options.delay = data.stage.data.showTimeMs;
      } else {
        options.audioUrl = data.progressData.currentStage?.sound || "";
        options.delay = data.progressData.currentStage?.showTimeMs || 2500;
      }

      if (options.audioUrl) {
        audio.src = `${viteBackendUrl}/${options.audioUrl}`;
        audio.play();
      }

      setTimeout(() => {
        audio.pause();
      }, options.delay || 2500);
    });

    return () => {
      obtainAchievement.off();
      audio.pause();
    };
  }, [obtainAchievement, setObtainedAchievements]);

  useEffect(() => {
    if (obtainedAchievements.length > MAX_ACHIEVEMENTS_IN_CACHE) {
      obtainedAchievements.splice(
        MAX_ACHIEVEMENTS_IN_CACHE,
        obtainedAchievements.length
      );
    }
  }, [obtainedAchievements]);

  useEffect(() => {
    obtainAchievementQueueInfo.on((count) => {
      setItemsQueLength(count);
    });
    return () => {
      obtainAchievementQueueInfo.off();
    };
  }, [obtainAchievementQueueInfo]);

  const currentFlexDirection = useMemo(
    () =>
      styles.direction === "column" || styles.direction === "horizontal"
        ? "column"
        : "row",
    [styles.direction]
  );

  return (
    <div
      className="achievements-overlay-wrapper"
      style={{
        borderRadius: styles.borderRadius,
        fontSize: styles.fontSize,
        flexDirection: currentFlexDirection,
      }}
    >
      <div
        className="achievements-overlay-wrapper-background"
        style={{
          background: styles.background,
          filter: `opacity(${styles.opacity}%)`,
          boxShadow: styles.boxShadow,
        }}
      ></div>
      <div
        className={`achievements-overlay-queue-length ${
          isEditor || (showAchievementsQueue && itemsQueLength > 1)
            ? "show"
            : "hide"
        }`}
        style={{
          color: styles.queue.color,
          fontSize: styles.queue.fontSize,
          borderRadius: styles.queue.borderRadius,
          ...(currentFlexDirection === "column"
            ? { margin: "0 0.7rem 0 0.7rem" }
            : { marginLeft: "0.3rem" }),
        }}
      >
        <div
          className="queue-length-background"
          style={{
            background: styles.queue.background,
            filter: `opacity(${styles.queue.opacity}%)`,
            boxShadow: styles.queue.boxShadow,
          }}
        ></div>
        <div>{itemsQueLength}+</div>
      </div>

      {obtainedAchievements.map((data) => (
        <AchievementDataBlock
          key={data.id}
          {...(isObtainedAchievement(data)
            ? {
                achievement: data,
                progress: null,
              }
            : {
                achievement: null,
                progress: data,
              })}
          flexDirection={currentFlexDirection}
        />
      ))}
    </div>
  );
}
