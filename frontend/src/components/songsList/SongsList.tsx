import { Loading, Error } from "@components/axiosHelper";
import Modal from "@components/modal";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import {
  fetchSongsDefaultParams,
  useGetSongs,
  useCreateSong,
  useEditSong,
} from "@services";
import { addNotification } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";
import { resetSongState, closeModal, setEditingId } from "@redux/songsSlice";
import { RootStore } from "@redux/store";
import FilterBarSongs from "./filterBarSongs";
import SongModalData from "./SongModalData";
import SongsData from "./SongsData";

export default function SongsList() {
  const queryParams = useQueryParams(fetchSongsDefaultParams);
  const { data: songs, isLoading, error } = useGetSongs(queryParams);

  const dispatch = useDispatch();
  const { isModalOpen, song, editingId } = useSelector(
    (state: RootStore) => state.songs
  );

  const createSongMutation = useCreateSong();
  const updateSongMutation = useEditSong();

  if (error) return <Error error={error} />;
  if (isLoading || !songs) return <Loading />;

  const handleCreateSong = () => {
    createSongMutation.mutate(song);
    dispatch(resetSongState());
  };

  const handleUpdateSong = () => {
    if (!editingId) {
      addNotification("Couldn't update song", "No song id", "warning");
      return;
    }
    updateSongMutation.mutate({
      id: editingId,
      updatedSong: song,
    });
    dispatch(resetSongState());
    dispatch(setEditingId(""));
  };

  return (
    <>
      <PreviousPage />
      <FilterBarSongs />
      <SongsData data={songs.data} />
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="songsListPageSize"
          currentPage={songs.currentPage}
          totalCount={songs.count}
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingId ? "Edit" : "Create"} song`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => (editingId ? handleUpdateSong() : handleCreateSong())}
        show={isModalOpen}
      >
        <SongModalData />
      </Modal>
    </>
  );
}
