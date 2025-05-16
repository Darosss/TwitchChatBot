import {
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
  useSocketContext,
} from "@socket";
import { isObtainedAchievement } from "@utils";
import { useEffect, useMemo, useState } from "react";
import { getExampleAchievementsData } from "./exampleData";
import { useLocalStorage } from "@hooks";
import { useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { AchievementDataBlock } from "./Data-Blocks";
import { useAchievementQueue } from "./use-achievements-queue";

export type ObtainedAchievementStateType =
  | ObtainAchievementDataWithCollectedAchievement
  | ObtainAchievementDataWithProgressOnly;

const MAX_ACHIEVEMENTS_IN_CACHE = 10;

export default function Achievements() {
  const socket = useSocketContext();
  const {
    events: { obtainAchievementQueueInfo },
  } = socket;

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

  //TODO: add progressBar via those.
  const { start, end, isActive } = useAchievementQueue(
    socket,
    setObtainedAchievements,

    {
      enabled: true,
      getAudioAndDelay: (data) => {
        if (isObtainedAchievement(data)) {
          return {
            audioUrl: data.stage.data.sound || "",
            delay: data.stage.data.showTimeMs || 2500,
          };
        } else {
          return {
            audioUrl: data.progressData.currentStage?.sound || "",
            delay: data.progressData.currentStage?.showTimeMs || 2500,
          };
        }
      },
    }
  );

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
