import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import FilterBarTriggers from "./filterBarTriggers";
import {
  useGetTriggers,
  useEditTrigger,
  useCreateTrigger,
  fetchTriggersDefaultParams,
} from "@services";
import { addNotification } from "@utils";
import TriggersData from "./TriggersData";
import TriggerModalData from "./TriggerModalData";
import { Loading } from "@components/axiosHelper";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";
import { RootStore } from "@redux/store";
import Error from "@components/axiosHelper/errors";
import {
  closeModal,
  resetTriggerState,
  setEditingId,
} from "@redux/triggersSlice";

export default function TriggersList() {
  const queryParams = useQueryParams(fetchTriggersDefaultParams);
  const { data: triggers, isLoading, error } = useGetTriggers(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    trigger: triggerState,
    editingId,
  } = useSelector((state: RootStore) => state.triggers);

  const createTriggerMutation = useCreateTrigger();
  const updateTriggerMutation = useEditTrigger();

  if (error) return <Error error={error} />;
  if (isLoading || !triggers) return <Loading />;
  const handleCreateTrigger = () => {
    createTriggerMutation.mutate(triggerState);
    dispatch(resetTriggerState());
    dispatch(closeModal());
  };

  const handleUpdateTrigger = () => {
    if (!editingId) {
      addNotification("Couldn't update trigger", "No trigger id", "warning");
      return;
    }
    updateTriggerMutation.mutate({
      id: editingId,
      updatedTrigger: triggerState,
    });
    dispatch(resetTriggerState());
    dispatch(setEditingId(""));
    dispatch(closeModal());
  };

  return (
    <>
      <PreviousPage />
      <FilterBarTriggers />
      <TriggersData data={triggers.data} />
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="triggersListPageSize"
          currentPage={triggers.currentPage}
          totalCount={triggers.count}
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingId ? "Edit" : "Create"} trigger`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => {
          editingId ? handleUpdateTrigger() : handleCreateTrigger();
        }}
        show={isModalOpen}
      >
        <TriggerModalData />
      </Modal>
    </>
  );
}
