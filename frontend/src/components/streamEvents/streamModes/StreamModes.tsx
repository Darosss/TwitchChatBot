import { Loading } from "@components/axiosHelper";
import { useEditTag, useEditMood, useEditAffix } from "@services";
import { useGetAllModes, addNotification } from "@utils";

export default function StreamModes() {
  const editTagMutation = useEditTag();

  const editMoodMutation = useEditMood();

  const editAffixMutation = useEditAffix();

  const modes = useGetAllModes();

  if (!modes) return <Loading />;
  const { tags, affixes, moods } = modes;

  return (
    <>
      <div className="stream-modes-wrapper">
        <div className="widget-header"> Stream modes </div>
        <div className="stream-modes-section-wrapper">
          <div className="stream-modes-section">
            <div className="stream-modes-section-name">
              <button className="common-button secondary-button">Tags </button>
            </div>
            {tags?.map((tag, index) => {
              return (
                <div key={index}>
                  <button
                    className={`common-button ${
                      tag.enabled ? "primary-button" : "danger-button"
                    }`}
                    onClick={() => {
                      editTagMutation.mutate({
                        id: tag._id,
                        updatedTag: { enabled: !tag.enabled },
                      });
                    }}
                  >
                    {tag.name}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="stream-modes-section">
            <div className="stream-modes-section-name">
              <button
                className="common-button secondary-button"
                onClick={(e) => {
                  let prefixes: string[] = [];
                  let suffixes: string[] = [];

                  affixes.forEach((affix) => {
                    if (!affix.enabled) return;
                    prefixes.push(affix.prefixes.join(" | "));
                    suffixes.push(affix.suffixes.join(" | "));
                  });
                  addNotification(
                    "Enabled prefixes",
                    `${prefixes.join(" | ")}`,
                    "info",
                    25000
                  );
                  addNotification(
                    "Enabled suffixes",
                    `${suffixes.join(" | ")}`,
                    "info",
                    25000
                  );
                }}
              >
                Affixes
              </button>
            </div>

            {affixes?.map((affix, index) => {
              return (
                <div key={index}>
                  <button
                    className={`common-button ${
                      affix.enabled ? "primary-button" : "danger-button"
                    }`}
                    onClick={() => {
                      editAffixMutation.mutate({
                        id: affix._id,
                        updatedAffix: { enabled: !affix.enabled },
                      });
                    }}
                  >
                    {affix.name}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="stream-modes-section">
            <div className="stream-modes-section-name">
              <button className="common-button secondary-button">Moods</button>
            </div>

            {moods?.map((mood, index) => {
              return (
                <div key={index}>
                  <button
                    className={`common-button ${
                      mood.enabled ? "primary-button" : "danger-button"
                    }`}
                    onClick={() => {
                      editMoodMutation.mutate({
                        id: mood._id,
                        updatedMood: { enabled: !mood.enabled },
                      });
                    }}
                  >
                    {mood.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
