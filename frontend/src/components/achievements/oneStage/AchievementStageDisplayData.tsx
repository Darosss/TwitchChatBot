import { viteBackendUrl } from "src/configs/envVariables";
import { useAchievementStageContext } from "./Context";

export default function AchievementStageDisplayData() {
  const {
    achievementStageState: [state],
  } = useAchievementStageContext();

  return (
    <>
      {state.stageData.map((data, index) => (
        <tr key={index} className="stage-data-content">
          <td>{index + 1}</td>
          <td>{data.name} </td>
          <td className="stage-data-number">{data.stage} </td>
          <td>
            <img
              src={`${viteBackendUrl}/${data.badge.imageUrl}`}
              alt={data.badge.name}
            />
          </td>
          <td className="stage-data-number">{data.rarity} </td>
          <td className="stage-data-number">{data.goal} </td>
          <td className="stage-data-number">
            {(data.showTimeMs / 1000).toFixed(1)}
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
