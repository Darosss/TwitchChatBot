import { ObtainAchievementData, useSocketContext } from "@socket";
import { convertSecondsToMS } from "@utils";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { viteBackendUrl } from "src/configs/envVariables";

export default function Achievements() {
  const {
    events: { obtainAchievement },
  } = useSocketContext();

  const wrapper = useRef<HTMLDivElement>(null);

  const [obtainedAchievements, setObtainedAchievements] = useState<
    ObtainAchievementData[]
  >([]);
  useEffect(() => {
    obtainAchievement.on((data) => {
      setObtainedAchievements((prevState) => [data, ...prevState]);
    });
    return () => {
      obtainAchievement.off();
    };
  }, [obtainAchievement]);

  return (
    <div
      className="achievements-overlay-wrapper"
      ref={wrapper}
      style={{
        fontSize: `${
          wrapper.current ? `${wrapper.current.offsetWidth / 500}dvw` : "2rem"
        }`,
      }}
    >
      {obtainedAchievements.map(({ stage, achievementName, username, id }) => {
        const [stageData, timestamp] = stage;
        return (
          <div
            key={id}
            className="obtained-achievements-wrapper animated-achievement"
          >
            <div className="achievements-overlay-background"></div>

            <div className="obtained-achievements-content">
              <div className="obtained-achievement-username">
                {username}
                <span>
                  obtained achievement <span>{achievementName} </span>
                </span>
              </div>

              <div className="obtained-achievement-details">
                <div className="obtained-achievements-stage-name">
                  {stageData.name}
                </div>

                <div>{moment(timestamp).format("HH:mm")}</div>
                <div className="obtained-achievements-goal">
                  Goal:
                  <span>
                    {achievementName.includes("TIME")
                      ? convertSecondsToMS(stageData.goal).join(":")
                      : stageData.goal}
                  </span>
                </div>
              </div>
            </div>
            <div className="obtained-achievements-badge">
              <img
                src={`${viteBackendUrl}/${stageData.badge.imageUrl}`}
                alt={stageData.name}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
