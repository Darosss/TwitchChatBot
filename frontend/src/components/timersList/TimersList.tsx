import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import FilterBarTimers from "./filterBarTimers";
import {
  useGetTimers,
  useEditTimer,
  useCreateTimer,
  fetchTimersDefaultParams,
} from "@services";
import TimersData from "./TimersData";
import TimerModalData from "./TimerModalData";
import { useQueryParams } from "@hooks/useQueryParams";
import { RootStore } from "@redux/store";
import { closeModal, resetTimerState, setEditingId } from "@redux/timersSlice";
import { useDispatch, useSelector } from "react-redux";
import { Error, Loading } from "@components/axiosHelper";
import { addNotification } from "@utils";

export default function TimersList() {
  const queryParams = useQueryParams(fetchTimersDefaultParams);
  const { data: timers, isLoading, error } = useGetTimers(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    timer: timerState,
    editingId,
  } = useSelector((state: RootStore) => state.timers);
  const createTimerMutation = useCreateTimer();
  const updateTimerMutation = useEditTimer();

  if (error) return <Error error={error} />;
  if (isLoading || !timers) return <Loading />;

  const handleCreateTimer = () => {
    createTimerMutation.mutate(timerState);
    dispatch(resetTimerState());
    dispatch(closeModal());
  };

  const handleUpdateTimer = () => {
    if (!editingId) {
      addNotification("Couldn't update timer", "No timer id", "warning");
      return;
    }
    updateTimerMutation.mutate({
      id: editingId,
      updatedTimer: timerState,
    });
    dispatch(resetTimerState());
    dispatch(setEditingId(""));
    dispatch(closeModal());
  };

  return (
    <>
      <PreviousPage />
      <FilterBarTimers />
      <TimersData data={timers.data} />
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="timersListPageSize"
          currentPage={timers.currentPage}
          totalCount={timers.count}
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingId ? "Edit" : "Create"} timer`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => {
          editingId ? handleUpdateTimer() : handleCreateTimer();
        }}
        show={isModalOpen}
      >
        <TimerModalData />
      </Modal>
    </>
  );
}
