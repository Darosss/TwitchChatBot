import { viteBackendUrl } from "src/configs/envVariables";
import { useAchievementStageContext } from "./Context";
import { TableDataWrapper } from "@components/tableWrapper";
import { getDateFromSecondsToYMDHMS } from "@utils";

export default function AchievementStageDisplayData() {
  const {
    achievementStageState: [state],
  } = useAchievementStageContext();

  return (
    <>
      {state.stageData.map((data, index) => (
        <tr key={index} className="stage-data-content">
          <td>{index + 1}</td>
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
              src={`${viteBackendUrl}/${data.badge.imageUrl}`}
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
