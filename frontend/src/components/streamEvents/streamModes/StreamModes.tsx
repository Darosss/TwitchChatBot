import React, { useEffect, useState } from "react";

import { useSocketContext } from "@socket";
import { addInfoNotification, useGetAllModes } from "@utils";
import { useEditTag, useEditAffix, useEditMood } from "@services";
import { Loading } from "@components/axiosHelper";

export default function StreamModes() {
  const {
    emits: { changeModes },
  } = useSocketContext();

  const [tagToUpdate, setTagToUpdate] = useState<[string, boolean]>([
    "",
    false,
  ]);
  const [affixToUpdate, setAffixToUpdate] = useState<[string, boolean]>([
    "",
    false,
  ]);
  const [moodToUpdate, setMoodToUpdate] = useState<[string, boolean]>([
    "",
    false,
  ]);

  const { refetchData: fetchEditTag } = useEditTag(tagToUpdate[0], {
    enabled: tagToUpdate[1],
  });

  const { refetchData: fetchAffixEdit } = useEditAffix(affixToUpdate[0], {
    enabled: affixToUpdate[1],
  });

  const { refetchData: fetchMoodEdit } = useEditMood(moodToUpdate[0], {
    enabled: moodToUpdate[1],
  });

  const modes = useGetAllModes();

  useEffect(() => {
    if (!tagToUpdate[0]) return;

    fetchEditTag().then(() => {
      refetchTags();
      changeModes();
      setTagToUpdate(["", false]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagToUpdate, changeModes]);

  useEffect(() => {
    if (!affixToUpdate[0]) return;

    fetchAffixEdit().then(() => {
      refetchAffixes();
      changeModes();
      setAffixToUpdate(["", false]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affixToUpdate, changeModes]);

  useEffect(() => {
    if (!moodToUpdate[0]) return;

    fetchMoodEdit().then(() => {
      refetchMoods();
      changeModes();
      setMoodToUpdate(["", false]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moodToUpdate, changeModes]);

  if (!modes) return <Loading />;

  const { tags, affixes, moods, refetchTags, refetchMoods, refetchAffixes } =
    modes;

  return (
    <>
      <div className="stream-modes-wrapper">
        <div className="widget-header"> Stream modes </div>
        <div className="stream-modes-section-wrapper">
          <div className="stream-modes-section">
            <div className="stream-modes-section-name">
              <button className="common-button secondary-button">Tags </button>
            </div>
            {tags?.map((tag, index) => (
              <div key={index}>
                <button
                  className={`common-button ${
                    tag.enabled ? "primary-button" : "danger-button"
                  }`}
                  onClick={() => {
                    setTagToUpdate([tag._id, !tag.enabled]);
                  }}
                >
                  {tag.name}
                </button>
              </div>
            ))}
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
                  addInfoNotification(
                    `Enabled prefixes ${prefixes.join(" | ")}`
                  );
                  addInfoNotification(
                    `Enabled suffixes ${suffixes.join(" | ")}`
                  );
                }}
              >
                Affixes
              </button>
            </div>

            {affixes?.map((affix, index) => (
              <div key={index}>
                <button
                  className={`common-button ${
                    affix.enabled ? "primary-button" : "danger-button"
                  }`}
                  onClick={() => {
                    setAffixToUpdate([affix._id, !affix.enabled]);
                  }}
                >
                  {affix.name}
                </button>
              </div>
            ))}
          </div>
          <div className="stream-modes-section">
            <div className="stream-modes-section-name">
              <button className="common-button secondary-button">Moods</button>
            </div>

            {moods?.map((mood, index) => (
              <div key={index}>
                <button
                  className={`common-button ${
                    mood.enabled ? "primary-button" : "danger-button"
                  }`}
                  onClick={() => {
                    setMoodToUpdate([mood._id, !mood.enabled]);
                  }}
                >
                  {mood.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
