import { ObtainAchievementData, useSocketContext } from "@socket";
import { convertSecondsToMS } from "@utils";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { viteBackendUrl } from "src/configs/envVariables";

export default function Achievements() {
  const {
    events: { obtainAchievement, obtainAchievementQueueInfo },
  } = useSocketContext();

  const wrapper = useRef<HTMLDivElement>(null);

  const [obtainedAchievements, setObtainedAchievements] = useState<
    ObtainAchievementData[]
  >([]);
  const [itemsQueLength, setItemsQueLength] = useState(0);
  useEffect(() => {
    const audio = new Audio();
    obtainAchievement.on((data) => {
      audio.pause();
      setObtainedAchievements((prevState) => [data, ...prevState]);

      const audioUrl = data.stage[0].audio;
      if (audioUrl) {
        audio.src = `${viteBackendUrl}/${audioUrl}`;
        audio.play();
      }
    });
    return () => {
      obtainAchievement.off();
      audio.pause();
    };
  }, [obtainAchievement]);

  useEffect(() => {
    if (obtainedAchievements.length > 20) {
      setObtainedAchievements((prevState) => {
        prevState.pop();
        return prevState;
      });
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
      <div
        className={`achievements-overlay-queue-length ${
          itemsQueLength !== 0 && itemsQueLength % 10 === 0 ? "show" : "hide"
        }`}
      >
        <div className="queue-length-background"></div>
        {itemsQueLength}+
      </div>

      {obtainedAchievements.map(({ stage, achievementName, username, id }) => {
        const [stageData, timestamp] = stage;

        return (
          <div
            key={id}
            className={`obtained-achievements-wrapper animated-achievement${
              stageData.rarity ? `-${stageData.rarity}` : ""
            }`}
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
