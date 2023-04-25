import React, { useContext, useEffect, useState } from "react";

import { SocketContext } from "@context/SocketContext";
import { getAllModes } from "@utils/getListModes";
import { editTag } from "@services/TagService";
import { editAffix } from "@services/AffixService";
import { editMood } from "@services/MoodService";

export default function StreamModes() {
  const socket = useContext(SocketContext);

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

  const { refetchData: fetchEditTag } = editTag(tagToUpdate[0], {
    enabled: tagToUpdate[1],
  });

  const { refetchData: fetchAffixEdit } = editAffix(affixToUpdate[0], {
    enabled: affixToUpdate[1],
  });

  const { refetchData: fetchMoodEdit } = editMood(moodToUpdate[0], {
    enabled: moodToUpdate[1],
  });

  const modes = getAllModes();

  useEffect(() => {
    if (!tagToUpdate[0]) return;

    fetchEditTag().then(() => {
      refetchTags();
      socket.emit("changeModes");
      setTagToUpdate(["", false]);
    });
  }, [tagToUpdate]);

  useEffect(() => {
    if (!affixToUpdate[0]) return;

    fetchAffixEdit().then(() => {
      refetchAffixes();
      socket.emit("changeModes");
      setAffixToUpdate(["", false]);
    });
  }, [affixToUpdate]);

  useEffect(() => {
    if (!moodToUpdate[0]) return;

    fetchMoodEdit().then(() => {
      refetchMoods();
      socket.emit("changeModes");
      setMoodToUpdate(["", false]);
    });
  }, [moodToUpdate]);

  if (!modes) return <> Loading...</>;

  const { tags, affixes, moods, refetchTags, refetchMoods, refetchAffixes } =
    modes;

  return (
    <>
      <div className="stream-modes-wrapper">
        <div className="widget-header"> Stream modes </div>
        <div className="stream-modes-section-wrapper">
          <div className="stream-modes-section">
            <div className="stream-modes-section-name">Tags</div>
            {tags?.map((tag, index) => {
              return (
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
              );
            })}
          </div>
          <div className="stream-modes-section">
            <div className="stream-modes-section-name">Affixes</div>

            {affixes?.map((affix, index) => {
              return (
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
              );
            })}
          </div>
          <div className="stream-modes-section">
            <div className="stream-modes-section-name">Moods</div>

            {moods?.map((mood, index) => {
              return (
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
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
