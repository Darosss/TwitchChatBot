import React, { useContext, useEffect, useReducer, useState } from "react";
import FilterBarCommands from "./filterBarCommands";
import Modal from "@components/modal";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import {
  SocketContext,
  socketEmitRefreshCommands,
} from "@context/SocketContext";
import { handleActionOnChangeState } from "@utils/handleDeleteApi";
import {
  getCommands,
  editCommand,
  createCommand,
  deleteCommand,
  ChatCommand,
  ChatCommandCreateData,
} from "@services/ChatCommandService";
import { addNotification } from "@utils/getNotificationValues";
import { getAllModes } from "@utils/getListModes";
import { DispatchAction } from "./types";
import CommandsData from "./CommandsData";
import CommandModalData from "./CommandModalData";

export default function CommandsList() {
  const socket = useContext(SocketContext);

  const [showModal, setShowModal] = useState(false);

  const [editingCommand, setEditingCommand] = useState("");
  const [commandIdDelete, setCommandIdDelete] = useState<string | null>(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const modes = getAllModes();

  const { data: commandsData, loading, error, refetchData } = getCommands();

  const { refetchData: fetchEditCommand } = editCommand(editingCommand, state);
  const { refetchData: fetchCreateCommand } = createCommand(state);
  const { refetchData: fetchDeleteCommand } = deleteCommand(
    commandIdDelete || ""
  );
  useEffect(() => {
    handleActionOnChangeState(commandIdDelete, setCommandIdDelete, () => {
      fetchDeleteCommand().then(() => {
        refetchData();
        addNotification("Deleted", `Command deleted successfully`, "danger");

        setCommandIdDelete(null);
      });
    });
  }, [commandIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;

  if (loading || !commandsData || !modes) return <> Loading...</>;

  const { data, count, currentPage } = commandsData;

  const onSubmitModalCreate = () => {
    fetchCreateCommand().then(() => {
      socketEmitRefreshCommands();
      addNotification("Success", "Command created successfully", "success");
      refetchData();
      setShowModal(false);
    });
  };

  const onSubmitModalEdit = () => {
    fetchEditCommand().then(() => {
      socketEmitRefreshCommands();
      addNotification("Success", "Command edited successfully", "success");
      refetchData();
      handleOnHideModal();
    });
    setShowModal(false);
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
        personality: command.personality._id,
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
        setCommandIdDelete={setCommandIdDelete}
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
  personality: "",
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
    case "SET_PERSONALITY":
      return { ...state, personality: action.payload };
    case "SET_MOOD":
      return { ...state, mood: action.payload };
    case "SET_STATE":
      return { ...state, ...action.payload };
    default:
      throw new Error("Invalid action type");
  }
}
