import { viteBackendUrl } from "@configs";
import { RootStore } from "@redux/store";
import {
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
} from "@socketTypes";
import moment from "moment";
import { CSSProperties } from "react";
import { useSelector } from "react-redux";
import {
  useObtainedAchievementContentData,
  useProgressContentData,
} from "./data-hooks";

interface AchievementDataBlockProps {
  achievement: ObtainAchievementDataWithCollectedAchievement | null;
  progress: ObtainAchievementDataWithProgressOnly | null;
  flexDirection: CSSProperties["flexDirection"];
}

export function AchievementDataBlock({
  achievement,
  progress,
  flexDirection,
}: AchievementDataBlockProps) {
  const {
    baseData: {
      styles: { overlayAchievements: styles },
    },
  } = useSelector((state: RootStore) => state.overlays);

  const currentRarity =
    achievement?.stage.data.rarity ||
    progress?.progressData.currentStage?.rarity;

  const obtainedAchievementContentData = useObtainedAchievementContentData(
    achievement,
    styles
  );
  const progressContentData = useProgressContentData(progress, styles);

  const currentRarityStyle =
    obtainedAchievementContentData?.rarityStyle ||
    progressContentData?.rarityStyle;
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
            obtainedAchievementContentData?.imgData.path ||
            progressContentData?.imgData.path
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
