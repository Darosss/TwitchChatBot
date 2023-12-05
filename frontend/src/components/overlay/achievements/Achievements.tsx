import {
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
  useSocketContext,
} from "@socket";
import { getDateFromSecondsToYMDHMS, isObtainedAchievement } from "@utils";
import moment from "moment";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { viteBackendUrl } from "src/configs/envVariables";
import { useOverlayDataContext } from "../OverlayDataContext";
import { getExampleAchievementsData } from "./exampleData";
import { BaseOverlayAchievementsRarity } from "src/layout/initialLayoutOverlays";

export type ObtainedAchievementStateType =
  | ObtainAchievementDataWithCollectedAchievement
  | ObtainAchievementDataWithProgressOnly;

const MAX_ACHIEVEMENTS_IN_CACHE = 10;

/*TODO: 
NOTE: AchievementDataBlock - needs to be refactored. I know it's a lot if one component. 

*/

export default function Achievements() {
  const {
    events: { obtainAchievement, obtainAchievementQueueInfo },
  } = useSocketContext();

  const {
    isEditorState: [isEditor],
    stylesState: [{ overlayAchievements: styles }],
  } = useOverlayDataContext();

  const [obtainedAchievements, setObtainedAchievements] = useState<
    ObtainedAchievementStateType[]
  >([]);

  const [showAchievementsQueue, setShowAchievementsQueue] = useState(false);
  const [itemsQueLength, setItemsQueLength] = useState(0);

  useEffect(() => {
    let showQueueInterval: NodeJS.Timer;

    showQueueInterval = setInterval(() => {
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
        options.audioUrl = data.stage.data.sound;
        options.delay = data.stage.data.showTimeMs;
      } else {
        options.audioUrl = data.progressData.currentStage?.sound;
        options.delay = data.progressData.currentStage?.showTimeMs;
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
  }, [obtainAchievement]);

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
interface AchievementDataBlockProps {
  achievement: ObtainAchievementDataWithCollectedAchievement | null;
  progress: ObtainAchievementDataWithProgressOnly | null;
  flexDirection: CSSProperties["flexDirection"];
}

//FIXME: refactor to smaller later
function AchievementDataBlock({
  achievement,
  progress,
  flexDirection,
}: AchievementDataBlockProps) {
  const {
    stylesState: [{ overlayAchievements: styles }],
  } = useOverlayDataContext();

  const currentRarity =
    achievement?.stage.data.rarity ||
    progress?.progressData.currentStage?.rarity;
  const rarityStyle = Object.keys(styles).find(
    (key) => key.includes("rarity") && key.includes(currentRarity)
  ) as keyof typeof styles;

  //TODO: right now I know it's rarity so assert as BaseOverlayAchievementsRarity - change later
  const currentRarityStyle = rarityStyle
    ? (styles[rarityStyle] as BaseOverlayAchievementsRarity)
    : null;

  const obtainedAchievementContentData = useMemo(() => {
    if (!achievement) return null;

    const obtainedAchievementName = (
      <span>
        obtained achievement{" "}
        <span style={{ color: currentRarityStyle?.achievementNameColor }}>
          {achievement.achievement.name}{" "}
        </span>
      </span>
    );

    const stageName = achievement?.stage.data.name;

    const goalInfo = (
      <>
        Goal:
        <span>
          {achievement?.achievement.isTime
            ? getDateFromSecondsToYMDHMS(achievement?.stage.data.goal)
            : achievement?.stage.data.goal}
        </span>
      </>
    );

    const imgPath = achievement.stage.data.badge.imagesUrls.x64;
    return { name: obtainedAchievementName, stageName, goalInfo, imgPath };
  }, [achievement, currentRarityStyle]);

  const progressContentData = useMemo(() => {
    if (!progress) return null;
    const {
      progressData: { currentStage, nextStage, progress: progressValue },
      achievement,
    } = progress;
    const progressName = (
      <span>
        made a progress in{" "}
        <span style={{ color: currentRarityStyle?.achievementNameColor }}>
          {achievement.name}
        </span>
      </span>
    );

    const currentNextStages = (
      <>
        <div>
          Current: <span>{currentStage?.name || "None"}</span>
        </div>
        {nextStage ? (
          <div
            className={`obtained-achievements-stage-name-next-stage ${
              nextStage.rarity ? `animated-achievement-${nextStage.rarity}` : ""
            }`}
          >
            Next: <span> {nextStage.name}</span>
          </div>
        ) : (
          <div className="obtained-achievements-stage-name-max-stage">
            <span> Maxed out!</span>
          </div>
        )}
      </>
    );

    const currentNextGoals = (
      <>
        <div>
          Progress:{" "}
          <span>
            {achievement.isTime
              ? getDateFromSecondsToYMDHMS(progressValue)
              : progressValue}
          </span>
        </div>
        <div>
          {!nextStage ? null : (
            <div>
              Next:
              <span>
                {achievement.isTime
                  ? getDateFromSecondsToYMDHMS(nextStage.goal)
                  : nextStage.goal}
              </span>
            </div>
          )}
        </div>
      </>
    );

    const imgPath =
      currentStage?.badge.imagesUrls.x64 || nextStage?.badge.imagesUrls.x64;
    return {
      name: progressName,
      stagesInfo: currentNextStages,
      goalInfo: currentNextGoals,
      imgPath,
    };
  }, [progress, currentRarityStyle]);

  return (
    <div
      key={achievement?.id || progress?.id}
      className={`obtained-achievements-wrapper animated-achievement${
        currentRarity ? `-${currentRarity}` : ""
      }`}
      style={{
        ...(flexDirection === "column"
          ? { margin: "0 0.5rem 0.5rem 0.5rem" }
          : { marginLeft: ".5rem" }),
      }}
    >
      <div
        className="obtained-achievement-timestamp"
        style={{
          color: currentRarityStyle?.timestampColor,
          fontSize: styles.timestampFontSize,
        }}
      >
        {moment(
          achievement?.stage.timestamp || progress?.progressData.timestamp
        ).format("HH:mm")}
      </div>
      <div
        className="achievements-overlay-background"
        style={{
          background: currentRarityStyle?.background,
          boxShadow: currentRarityStyle?.boxShadow,
          filter: `opacity(${currentRarityStyle?.opacity}%)`,
        }}
      ></div>

      <div
        className="obtained-achievements-content"
        style={{ color: currentRarityStyle?.textColor }}
      >
        <div className="obtained-achievement-username">
          <span style={{ color: currentRarityStyle?.usernameColor }}>
            {achievement?.username || progress?.username}
          </span>{" "}
          {obtainedAchievementContentData?.name || progressContentData?.name}
        </div>

        <div className="obtained-achievement-details">
          <div
            className="obtained-achievements-stage-name"
            style={{ color: currentRarityStyle?.stagesNameColor }}
          >
            {progressContentData?.stagesInfo ||
              obtainedAchievementContentData?.stageName}
          </div>

          <div
            className="obtained-achievements-goal"
            style={{ color: currentRarityStyle?.goalColor }}
          >
            {progressContentData?.goalInfo ||
              obtainedAchievementContentData?.goalInfo}
          </div>
        </div>
      </div>
      <div
        className={`obtained-achievements-badge ${
          progress && !progress.progressData.currentStage
            ? "obtained-achievements-badge-not-achieved"
            : ""
        }`}
      >
        <img
          src={`${viteBackendUrl}${
            obtainedAchievementContentData?.imgPath ||
            progressContentData?.imgPath
          }`}
          className={`${
            achievement
              ? ""
              : !progress?.progressData.currentStage
              ? "obtained-achievements-badge-not-achieved"
              : ""
          }`}
          style={{
            maxWidth: styles.badgeSize,
            minWidth: styles.badgeSize,
            maxHeight: styles.badgeSize,
            minHeight: styles.badgeSize,
            boxShadow: currentRarityStyle?.badgeBoxShadow,
          }}
          alt={achievement?.achievement.name || progress?.achievement.name}
        />
      </div>
    </div>
  );
}
