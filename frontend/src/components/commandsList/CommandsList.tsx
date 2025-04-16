import Modal from "@components/modal";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import {
  fetchChatCommandsDefaultParams,
  useCreateChatCommand,
  useEditChatCommand,
  useGetChatCommands,
} from "@services";
import { addNotification } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCommandState,
  setEditingId,
  closeModal,
} from "@redux/commandsSlice";
import { RootStore } from "@redux/store";
import CommandModalData from "./CommandModalData";
import CommandsData from "./CommandsData";
import FilterBarCommands from "./filterBarCommands";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";

export default function CommandsList() {
  const dispatch = useDispatch();
  const queryParams = useQueryParams(fetchChatCommandsDefaultParams);

  const {
    isModalOpen,
    command: commandState,
    editingId,
  } = useSelector((state: RootStore) => state.commands);

  const createCommandMutation = useCreateChatCommand();
  const updateCommandMutation = useEditChatCommand();

  const {
    data: commandsData,
    isLoading,
    error,
  } = useGetChatCommands(queryParams);

  const handleCreateCommand = () => {
    createCommandMutation.mutate(commandState);
    dispatch(closeModal());
    dispatch(resetCommandState());
  };

  const handleUpdateCommand = () => {
    if (!editingId) {
      addNotification("Couldn't update command", "No command id", "warning");
      return;
    }
    updateCommandMutation.mutate({
      id: editingId,
      updatedChatCommand: commandState,
    });
    dispatch(closeModal());
    dispatch(resetCommandState());
    dispatch(setEditingId(""));
  };
  if (error) return <Error error={error} />;
  if (isLoading || !commandsData) return <Loading />;

  return (
    <>
      <PreviousPage />
      <FilterBarCommands />
      <CommandsData commands={commandsData.data} />
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="commandsListPageSize"
          currentPage={commandsData.currentPage}
          totalCount={commandsData.count}
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingId ? "Edit" : "Create"} command`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() =>
          editingId ? handleUpdateCommand() : handleCreateCommand()
        }
        show={isModalOpen}
      >
        <CommandModalData />
      </Modal>
    </>
  );
}
