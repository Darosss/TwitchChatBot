import React, { useEffect, useReducer, useState } from "react";
import PreviousPage from "@components/previousPage";
import FilterBarSongs from "./filterBarSongs";
import Pagination from "@components/pagination";
import {
  Song,
  SongCreateData,
  useCreateSong,
  useDeleteSong,
  useEditSong,
  useGetSongs,
} from "@services";
import SongsData from "./SongsData";
import { DispatchAction } from "./types";
import Modal from "@components/modal";
import { addNotification, handleActionOnChangeState } from "@utils";
import SongModalData from "./SongModalData";

export default function SongsLIst() {
  const [showModal, setShowModal] = useState(false);
  const { data: songsData, loading, error, refetchData } = useGetSongs();

  const [state, dispatch] = useReducer(reducer, initialState);

  const [editingSong, setEditingSong] = useState("");
  const [songIdToDelete, setSongIdToDelete] = useState<string | null>(null);

  const { refetchData: fetchEditSong } = useEditSong(editingSong, state);
  const { refetchData: fetchCreateSong } = useCreateSong(state);
  const { refetchData: fetchDeleteSong } = useDeleteSong(songIdToDelete || "");

  useEffect(() => {
    handleActionOnChangeState(songIdToDelete, setSongIdToDelete, () => {
      fetchDeleteSong().then(() => {
        refetchData();
        addNotification("Deleted", "Song deleted successfully", "danger");
        setSongIdToDelete(null);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songIdToDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !songsData) return <> Loading...</>;
  const { data, count, currentPage } = songsData;

  const onSubmitModalCreate = () => {
    fetchCreateSong()
      .then(() => {
        addNotification("Success", "Song created successfully", "success");
        refetchData();
        setShowModal(false);
      })
      .catch((err) =>
        addNotification(
          "ERROR",
          err.response?.data?.message || "Couldn't create song",
          "danger"
        )
      );
  };

  const onSubmitModalEdit = () => {
    fetchEditSong().then(() => {
      addNotification("Success", "Song edited successfully", "success");
      refetchData();
      handleOnHideModal();
    });
  };

  const handleOnShowEditModal = (song: Song) => {
    setEditingSong(song._id);
    setState(song);
    setShowModal(true);
  };

  const handleOnShowCreateModal = (song?: Song) => {
    if (song) {
      setState(song);
    } else {
      dispatch({ type: "SET_STATE", payload: initialState });
    }

    setShowModal(true);
  };

  const handleOnHideModal = () => {
    setShowModal(false);
    setEditingSong("");
  };

  const setState = ({
    title,
    youtubeId,
    customTitle,
    customId,
    duration,
    whoAdded,
  }: Song) => {
    dispatch({
      type: "SET_STATE",
      payload: {
        title,
        whoAdded: whoAdded._id,
        youtubeId,
        customTitle,
        duration,
        customId,
      },
    });
  };

  return (
    <>
      <PreviousPage />
      <FilterBarSongs />
      <SongsData
        data={data}
        handleOnShowCreateModal={handleOnShowCreateModal}
        handleOnShowEditModal={handleOnShowEditModal}
        setSongIdDelete={setSongIdToDelete}
      />
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="songsListPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingSong ? "Edit" : "Create"} trigger`}
        onClose={handleOnHideModal}
        onSubmit={() => {
          editingSong ? onSubmitModalEdit() : onSubmitModalCreate();
        }}
        show={showModal}
      >
        <SongModalData state={state} dispatch={dispatch} />
      </Modal>
    </>
  );
}

const initialState: SongCreateData = {
  title: "",
  youtubeId: "",
  customTitle: { title: "", band: "" },
  duration: 0,
  customId: "",
  whoAdded: "",
};

function reducer(
  state: SongCreateData,
  action: DispatchAction
): SongCreateData {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_YOUTUBE_ID":
      return { ...state, youtubeId: action.payload };
    case "SET_CUSTOM_TITLE":
      return { ...state, customTitle: action.payload };
    case "SET_DURATION":
      return { ...state, duration: action.payload };
    case "SET_CUSTOM_ID":
      return { ...state, customId: action.payload };
    case "SET_WHO_ADDED":
      return { ...state, whoAdded: action.payload };
    case "SET_STATE":
      return { ...action.payload };
    default:
      throw new Error("Invalid action type");
  }
}
