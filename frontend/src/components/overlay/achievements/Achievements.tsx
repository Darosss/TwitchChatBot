import {
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
  useSocketContext,
} from "@socket";
import { getDateFromSecondsToYMDHMS, isObtainedAchievement } from "@utils";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { viteBackendUrl } from "src/configs/envVariables";
type ObtainedAchievementStateType =
  | ObtainAchievementDataWithCollectedAchievement
  | ObtainAchievementDataWithProgressOnly;
export default function Achievements() {
  const {
    events: { obtainAchievement, obtainAchievementQueueInfo },
  } = useSocketContext();

  const wrapper = useRef<HTMLDivElement>(null);

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
          wrapper.current ? `${wrapper.current.offsetWidth / 600}rem` : "2rem"
        }`,
      }}
    >
      <div
        className={`achievements-overlay-queue-length ${
          showAchievementsQueue && itemsQueLength > 1 ? "show" : "hide"
        }`}
      >
        <div className="queue-length-background"></div>
        {itemsQueLength}+
      </div>

      {obtainedAchievements.map((data) => {
        return isObtainedAchievement(data) ? (
          <AchievementDataBlock key={data.id} data={data} />
        ) : (
          <AchievementProgressDataBlock key={data.id} data={data} />
        );
      })}
    </div>
  );
}

interface AchievementDataBlockProps {
  data: ObtainAchievementDataWithCollectedAchievement;
}
function AchievementDataBlock({
  data: {
    stage: { data, timestamp },
    id,
    username,
    achievement,
  },
}: AchievementDataBlockProps) {
  return (
    <div
      key={id}
      className={`obtained-achievements-wrapper animated-achievement${
        data.rarity ? `-${data.rarity}` : ""
      }`}
    >
      <div className="achievements-overlay-background"></div>

      <div className="obtained-achievements-content">
        <div className="obtained-achievement-username">
          {username}{" "}
          <span>
            obtained achievement <span>{achievement.name} </span>
          </span>
        </div>

        <div className="obtained-achievement-details">
          <div className="obtained-achievements-stage-name">{data.name}</div>

          <div className="obtained-achievement-timestamp">
            {moment(timestamp).format("HH:mm")}
          </div>
          <div className="obtained-achievements-goal">
            Goal:
            <span>
              {achievement.isTime
                ? getDateFromSecondsToYMDHMS(data.goal)
                : data.goal}
            </span>
          </div>
        </div>
      </div>
      <div className="obtained-achievements-badge">
        <img
          src={`${viteBackendUrl}/${data.badge.imagesUrls.x64}`}
          alt={data.name}
        />
      </div>
    </div>
  );
}

interface AchievementProgressDataBlockProps {
  data: ObtainAchievementDataWithProgressOnly;
}
function AchievementProgressDataBlock({
  data: {
    id,
    progressData: { currentStage, nextStage, progress, timestamp },
    username,
    achievement,
  },
}: AchievementProgressDataBlockProps) {
  const renderProgressDivs = () => {
    return (
      <>
        <div>
          Progress:{" "}
          <span>
            {achievement.isTime
              ? getDateFromSecondsToYMDHMS(progress)
              : progress}
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
  };
  return (
    <div
      key={id}
      className={`obtained-achievements-wrapper achievement-progress-wrapper animated-achievement${
        currentStage?.rarity ? `-${currentStage.rarity}` : ""
      }`}
    >
      <div className="achievements-overlay-background"></div>

      <div className="obtained-achievements-content">
        <div className="obtained-achievement-username">
          {username}
          <span>
            {" "}
            made a progress in <span>{achievement.name} </span> achievement
          </span>
        </div>

        <div className="obtained-achievement-details">
          <div className="obtained-achievements-stage-name">
            <div className="obtained-achievements-stage-name-header">STAGE</div>

            <div>
              {" "}
              Current: <span>{currentStage?.name || "None"}</span>
            </div>
            {nextStage ? (
              <div
                className={`obtained-achievements-stage-name-next-stage ${
                  nextStage.rarity
                    ? `animated-achievement-${nextStage.rarity}`
                    : ""
                }`}
              >
                Next: <span> {nextStage.name}</span>
              </div>
            ) : (
              <div className="obtained-achievements-stage-name-max-stage">
                <span> Maxed out!</span>
              </div>
            )}
          </div>

          <div className="obtained-achievement-timestamp">
            {moment(timestamp).format("HH:mm")}
          </div>
          <div className="obtained-achievements-goal">
            {renderProgressDivs()}
          </div>
        </div>
      </div>
      <div className="obtained-achievements-badge">
        <img
          className={`${
            !currentStage ? "obtained-achievements-badge-not-achieved" : ""
          }`}
          src={`${viteBackendUrl}/${
            currentStage
              ? currentStage?.badge.imagesUrls.x64
              : nextStage?.badge.imagesUrls.x64
          }`}
          alt={currentStage?.name}
        />
      </div>
    </div>
  );
}
