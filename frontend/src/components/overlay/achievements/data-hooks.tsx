import {
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
} from "@socketTypes";
import { getDateFromSecondsToYMDHMS } from "@utils";
import { useMemo } from "react";
import {
  BaseOverlayAchievementsRarity,
  OverlayAchievementsStyleParsed,
} from "src/layout/overlays/types";

export const useObtainedAchievementContentData = (
  data: ObtainAchievementDataWithCollectedAchievement | null,
  styles: OverlayAchievementsStyleParsed
) =>
  useMemo(() => {
    if (!data) return null;
    const { achievement, stage } = data;
    const currentRarity = stage.data.rarity;
    const rarityStyle = Object.keys(styles).find(
      (key) => key.includes("rarity") && key.includes(`${currentRarity}`)
    ) as keyof typeof styles;

    const currentRarityStyle = rarityStyle
      ? (styles[rarityStyle] as BaseOverlayAchievementsRarity)
      : null;

    const obtainedAchievementName = (
      <span>
        got achievement{" "}
        <span style={{ color: currentRarityStyle?.achievementNameColor }}>
          {achievement.name}{" "}
        </span>
      </span>
    );

    const stageName = stage.data.name;

    const goalInfo = (
      <>
        <span>
          Goal:{" "}
          {achievement?.isTime
            ? getDateFromSecondsToYMDHMS(stage.data.goal)
            : stage.data.goal}
        </span>
      </>
    );
    const imgPath = stage.data.badge.imagesUrls.x64;
    return {
      name: obtainedAchievementName,
      stageName,
      goalInfo,
      imgData: { path: imgPath || "", size: 64 },
      rarity: stage.data.rarity,
      rarityStyle: currentRarityStyle,
    };
  }, [data, styles]);

export const useProgressContentData = (
  data: ObtainAchievementDataWithProgressOnly | null,
  styles: OverlayAchievementsStyleParsed
) =>
  useMemo(() => {
    if (!data) return null;
    const {
      progressData: { currentStage, nextStage, progress: progressValue },
      achievement,
    } = data;
    const currentRarity = currentStage?.rarity;
    const rarityStyle = Object.keys(styles).find(
      (key) => key.includes("rarity") && key.includes(`${currentRarity}`)
    ) as keyof typeof styles;

    const currentRarityStyle = rarityStyle
      ? (styles[rarityStyle] as BaseOverlayAchievementsRarity)
      : null;

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
      imgData: { path: imgPath || "", size: 64 },
      rarity: currentStage?.rarity,
      rarityStyle: currentRarityStyle,
    };
  }, [data, styles]);
