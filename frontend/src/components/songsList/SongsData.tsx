import React, { useState } from "react";
import { Song } from "@services";
import { TableListWrapper } from "@components/tableWrapper";
import SortByParamsButton from "@components/SortByParamsButton";
import { DateTooltip } from "@components/dateTooltip";
import PreviewSongModal from "./PreviewSongModal";
import { generateEnabledDisabledDiv } from "@utils";

interface SongsDataProps {
  data: Song[];
  handleOnShowEditModal: (song: Song) => void;
  handleOnShowCreateModal: (song?: Song) => void;
  setSongIdDelete: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function SongsData({
  data,
  handleOnShowCreateModal,
  handleOnShowEditModal,
  setSongIdDelete,
}: SongsDataProps) {
  const [previewedSong, setPrevievedSong] = useState<Song | null>(null);
  return (
    <>
      <TableListWrapper
        theadChildren={
          <tr>
            <th>
              Actions
              <button
                className="common-button primary-button"
                onClick={(e) => handleOnShowCreateModal()}
              >
                New
              </button>
            </th>
            <th>
              <SortByParamsButton buttonText="Title" sortBy="title" />
            </th>
            <th>
              <SortByParamsButton buttonText="Youtube Id" sortBy="youtubeId" />
            </th>
            <th>Custom Id</th>
            <th>
              <SortByParamsButton buttonText="Uses" sortBy="uses" />
            </th>
            <th>
              <SortByParamsButton buttonText="Enabled" sortBy="enabled" />
            </th>
            <th>
              <SortByParamsButton buttonText="botUses" sortBy="botUses" />
            </th>
            <th>
              <SortByParamsButton
                buttonText="SR Uses"
                sortBy="songRequestUses"
              />
            </th>
            <th>
              <SortByParamsButton buttonText="Duration" sortBy="duration" />
            </th>
            <th>
              <SortByParamsButton buttonText="Last used" sortBy="lastUsed" />
            </th>
            <th>
              <SortByParamsButton buttonText="Created At" sortBy="createdAt" />
            </th>
            <th>
              <SortByParamsButton buttonText="Updated at" sortBy="updatedAt" />
            </th>
            <th>Who added</th>
          </tr>
        }
        tbodyChildren={data.map((song, index) => {
          return (
            <tr
              key={index}
              className="songs-data-table-song-details"
              onClick={(e) => {
                setPrevievedSong(song);
              }}
            >
              <td>
                <div className="songs-data-table-actions">
                  <button
                    className="common-button primary-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOnShowEditModal(song);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="common-button danger-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSongIdDelete(song._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
              <td>{song.title}</td>
              <td>{song.youtubeId}</td>
              <td>{song.customId || ""}</td>
              <td>{song.uses}</td>
              <td>
                {generateEnabledDisabledDiv(
                  song.enabled,
                  song.enabled.toString()
                )}
              </td>
              <td>{song.botUses}</td>
              <td>{song.songRequestUses}</td>
              <td>{song.duration}</td>
              <td>
                {song.lastUsed ? <DateTooltip date={song.lastUsed} /> : null}
              </td>
              <td>
                <DateTooltip date={song.createdAt} />
              </td>
              <td>
                <DateTooltip date={song.updatedAt} />
              </td>
              <td>{song.whoAdded.username}</td>
            </tr>
          );
        })}
      ></TableListWrapper>

      {previewedSong ? (
        <PreviewSongModal
          song={previewedSong}
          onCloseModal={() => setPrevievedSong(null)}
        />
      ) : null}
    </>
  );
}
