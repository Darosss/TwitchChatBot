import { viteBackendUrl } from "src/configs/envVariables";
import { useAchievementStageContext } from "./Context";
import { TableDataWrapper } from "@components/tableWrapper";
import { getDateFromSecondsToYMDHMS } from "@utils";
import { useSocketContext } from "@socket";
import { AchievementStageData } from "@services";

export default function AchievementStageDisplayData() {
  const {
    achievementStageState: [state],
  } = useAchievementStageContext();

  return (
    <>
      {state.stageData.map((data, index) => (
        <tr key={index} className="stage-data-content">
          <td className="stage-data-content-nr-emulate">
            <div>
              <div>
                <EmulateStageButton stageData={data} />
              </div>
              <div>{index + 1}</div>
            </div>
          </td>
          <td>
            <TableDataWrapper>
              <div>Name</div>
              <div>{data.name}</div>
              <div>Stage</div>
              <div>{data.stage}</div>
              <div>Rarity</div>
              <div>{data.rarity}</div>
            </TableDataWrapper>
          </td>
          <td className="stage-data-goal">
            <TableDataWrapper>
              <div>Goal</div>
              <div>{data.goal}</div>
              <div>
                Seen duration
                <br />
                (only for time stages)
              </div>
              <div>{getDateFromSecondsToYMDHMS(data.goal)}</div>
            </TableDataWrapper>
          </td>
          <td className="stage-data-number">
            {(data.showTimeMs / 1000).toFixed(1)}
          </td>
          <td>
            <img
              src={`${viteBackendUrl}/${data.badge.imagesUrls.x128}`}
              alt={data.badge.name}
            />
          </td>
          <td className="stage-data-sound-wrapper">
            <div>
              <div>{data.sound} </div>
              {data.sound ? (
                <audio
                  className="stage-data-sound"
                  src={`${viteBackendUrl}/${data.sound}`}
                  controls
                />
              ) : null}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

interface EmulateStageButtonProps {
  stageData: AchievementStageData;
}
function EmulateStageButton({ stageData }: EmulateStageButtonProps) {
  const {
    emits: { emulateAchievement },
  } = useSocketContext();

  const handleOnClickEmulate = (isTime = false) =>
    emulateAchievement({
      id: Math.random().toString(),
      achievement: {
        name: "Emited achievement",
        isTime: isTime,
      },
      username: "Emited username",
      stage: [stageData, new Date().getTime()],
    });
  return (
    <>
      <div>
        <button
          className="common-button tertiary-button"
          onClick={() => handleOnClickEmulate()}
        >
          Emulate
        </button>
        <button
          className="common-button tertiary-button"
          onClick={() => handleOnClickEmulate(true)}
        >
          Emulate as time
        </button>
      </div>
    </>
  );
}
