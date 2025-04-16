import { Error, Loading } from "@components/axiosHelper";
import CardboxWrapper from "@components/cardboxWrapper";
import Modal from "@components/modal";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import {
  fetchMoodsDefaultParams,
  useGetMoods,
  useCreateMood,
  useEditMood,
} from "@services";
import { addNotification } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";
import { closeModal, resetMoodState, setEditingId } from "@redux/moodsSlice";
import { RootStore } from "@redux/store";
import FilterBarModes from "../filterBarModes";
import MoodsData from "./MoodsData";
import MoodModalData from "./MoodModalData";

export default function Moods() {
  const queryParams = useQueryParams(fetchMoodsDefaultParams);
  const { data: moods, isLoading, error } = useGetMoods(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    mood: moodState,
    editingId,
  } = useSelector((state: RootStore) => state.moods);

  const createMoodMutation = useCreateMood();
  const updateMoodMutation = useEditMood();

  if (error) return <Error error={error} />;
  if (isLoading || !moods) return <Loading />;

  const handleCreateMood = () => {
    createMoodMutation.mutate(moodState);
    dispatch(resetMoodState());
  };

  const handleUpdateMood = () => {
    if (!editingId) {
      addNotification("Couldn't update mood", "No mood id", "warning");
      return;
    }
    updateMoodMutation.mutate({
      id: editingId,
      updatedMood: moodState,
    });
    dispatch(resetMoodState());
    dispatch(setEditingId(""));
  };

  return (
    <>
      <PreviousPage />
      <FilterBarModes />
      <CardboxWrapper title={"Moods list"}>
        <MoodsData data={moods.data} />
      </CardboxWrapper>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="moodsListPageSize"
          currentPage={moods.currentPage}
          totalCount={moods.count}
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingId ? "Edit" : "Create"} mood`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => (editingId ? handleUpdateMood() : handleCreateMood())}
        show={isModalOpen}
      >
        <MoodModalData />
      </Modal>
    </>
  );
}
