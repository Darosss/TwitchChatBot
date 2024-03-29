import React, { useReducer, useState } from "react";
import FilterBarCommands from "./filterBarCommands";
import Modal from "@components/modal";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import { addSuccessNotification } from "@utils";
import {
  useGetCommands,
  useEditCommand,
  useCreateCommand,
  useDeleteCommand,
  ChatCommand,
  ChatCommandCreateData,
} from "@services";
import { useGetAllModes } from "@utils";
import { DispatchAction } from "./types";
import CommandsData from "./CommandsData";
import CommandModalData from "./CommandModalData";
import { useSocketContext } from "@socket";
import { AxiosError, Loading } from "@components/axiosHelper";
import { useAxiosWithConfirmation } from "@hooks";

export default function CommandsList() {
  const [showModal, setShowModal] = useState(false);

  const {
    emits: { refreshCommands: emitRefreshCommands },
  } = useSocketContext();

  const [editingCommand, setEditingCommand] = useState("");

  const [state, dispatch] = useReducer(reducer, initialState);

  const modes = useGetAllModes();

  const { data: commandsData, loading, error, refetchData } = useGetCommands();

  const { refetchData: fetchEditCommand } = useEditCommand(
    editingCommand,
    state
  );
  const { refetchData: fetchCreateCommand } = useCreateCommand(state);

  const setCommandIdToDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteCommand,
    opts: { onFullfiled: () => refetchData() },
  });

  if (error) return <AxiosError error={error} />;
  if (loading || !commandsData || !modes) return <Loading />;

  const { data, count, currentPage } = commandsData;

  const onSubmitModalCreate = () => {
    fetchCreateCommand().then(() => {
      emitRefreshCommands();
      addSuccessNotification("Command created successfully");
      refetchData();
      handleOnHideModal();
    });
  };

  const onSubmitModalEdit = () => {
    fetchEditCommand().then(() => {
      emitRefreshCommands();
      addSuccessNotification("Command edited successfully");
      refetchData();
      handleOnHideModal();
    });
  };

  const setState = (command: ChatCommand) => {
    dispatch({
      type: "SET_STATE",
      payload: {
        name: command.name,
        description: command.description,
        enabled: command.enabled,
        aliases: command.aliases,
        messages: command.messages,
        privilege: command.privilege,
        tag: command.tag._id,
        mood: command.mood._id,
      },
    });
  };

  const handleOnShowEditModal = (command: ChatCommand) => {
    setEditingCommand(command._id);
    setState(command);
    setShowModal(true);
  };

  const handleOnShowCreateModal = (command?: ChatCommand) => {
    if (command) {
      setState(command);
    } else {
      dispatch({ type: "SET_STATE", payload: initialState });
    }

    setShowModal(true);
  };

  const handleOnHideModal = () => {
    setShowModal(false);
    setEditingCommand("");
  };

  return (
    <>
      <PreviousPage />
      <FilterBarCommands />
      <CommandsData
        data={data}
        handleOnShowCreateModal={handleOnShowCreateModal}
        handleOnShowEditModal={handleOnShowEditModal}
        setCommandIdDelete={setCommandIdToDelete}
      />
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="commandsListPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingCommand ? "Edit" : "Create"} command`}
        onClose={handleOnHideModal}
        onSubmit={() => {
          editingCommand ? onSubmitModalEdit() : onSubmitModalCreate();
        }}
        show={showModal}
      >
        <CommandModalData state={state} dispatch={dispatch} modes={modes} />
      </Modal>
    </>
  );
}

const initialState: ChatCommandCreateData = {
  name: "",
  description: "",
  enabled: true,
  aliases: [""],
  messages: [""],
  privilege: 0,
  tag: "",
  mood: "",
};

function reducer(
  state: ChatCommandCreateData,
  action: DispatchAction
): ChatCommandCreateData {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_ENABLED":
      return { ...state, enabled: action.payload || !state.enabled };
    // case "SET_DELAY":
    //   return { ...state, delay: action.payload };
    case "SET_PRIVILEGE":
      return { ...state, privilege: action.payload };
    case "SET_ALIASES":
      return { ...state, aliases: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_DESC":
      return { ...state, description: action.payload };
    case "SET_TAG":
      return { ...state, tag: action.payload };
    case "SET_MOOD":
      return { ...state, mood: action.payload };
    case "SET_STATE":
      return { ...state, ...action.payload };
    default:
      throw new Error("Invalid action type");
  }
}
