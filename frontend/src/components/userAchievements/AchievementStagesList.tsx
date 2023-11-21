import { DateTooltip } from "@components/dateTooltip";
import {
  Achievement,
  AchievementStageData,
  useGetUserAchievementsProgresses,
} from "@services";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { viteBackendUrl } from "src/configs/envVariables";

interface AchievementStagesListsProps {
  achievement: Achievement;
  expandAll: boolean;
}

export default function AchievementStageLists({
  achievement,
  expandAll,
}: AchievementStagesListsProps) {
  const [showSection, setShowSection] = useState(true);

  return (
    <div
      className="achievements-list-wrapper"
      onClick={() => setShowSection(!showSection)}
    >
      <div className="achievement-section">
        <div>
          {achievement.name} - {achievement.description}
        </div>
        <div className="achievement-secret">
          {achievement.hidden ? "Secret achievement" : null}
        </div>
      </div>
      {showSection || expandAll
        ? achievement.stages.stageData.map((stage, index) => (
            <AchievementStage
              key={index}
              achievementId={achievement._id}
              stage={stage}
            />
          ))
        : null}
    </div>
  );
}

interface AchievementStageProps {
  achievementId: string;
  stage: AchievementStageData;
}
function AchievementStage({ achievementId, stage }: AchievementStageProps) {
  const { userId } = useParams();
  const { data: achivementsProgressData } = useGetUserAchievementsProgresses(
    userId || ""
  );

  const foundProgresses = useMemo(
    () =>
      achivementsProgressData?.data.find(
        (progress) => progress.achievement._id === achievementId
      ),
    [achievementId, achivementsProgressData]
  );
  const foundProgress = foundProgresses?.progresses.find(
    ([progressStage]) => progressStage === stage.stage
  );

  return (
    <div
      className={`achievement-stage-wrapper ${
        !foundProgress ? "not-achieved" : "achieved"
      }`}
    >
      <div>{stage.name}</div>

      <div className="current-progress">
        {foundProgresses?.value}/{stage.goal}
      </div>
      <div className="achievement-obtained-at">
        {foundProgress ? <DateTooltip date={foundProgress[1]} /> : ""}
      </div>
      <img
        src={`${viteBackendUrl}/${stage.badge.imagesUrls.x128}`}
        alt={stage.name}
      />
    </div>
  );
}
