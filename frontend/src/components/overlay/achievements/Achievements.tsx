import { ObtainAchievementData, useSocketContext } from "@socket";
import { convertSecondsToMS } from "@utils";
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
      {obtainedAchievements.map((data) => (
        <div
          key={data.stage.goal + data.achievementName}
          className="obtained-achievements-wrapper animated-achievement"
        >
          <div className="achievements-overlay-background"></div>

          <div className="obtained-achievements-content">
            <div className="obtained-achievement-username">
              {data.username}{" "}
              <span>
                {" "}
                obtained achievement <span>{data.achievementName} </span>
              </span>
            </div>

            <div className="obtained-achievement-details">
              <div className="obtained-achievements-stage-name">
                {data.stage.name}
              </div>
              <div className="obtained-achievements-goal">
                Goal:{" "}
                <span>
                  {data.achievementName.includes("TIME")
                    ? convertSecondsToMS(data.stage.goal).join(":")
                    : data.stage.goal}
                </span>
              </div>
            </div>
          </div>
          <div className="obtained-achievements-badge">
            <img
              src={`${viteBackendUrl}/${data.stage.badge.imageUrl}`}
              alt={data.stage.name}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
