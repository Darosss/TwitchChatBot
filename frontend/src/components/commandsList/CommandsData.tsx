import { generateEnabledDisabledDiv } from "@utils";
import { DateTooltip } from "@components/dateTooltip";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";
import { ChatCommand, useDeleteChatCommand } from "@services";
import SortByParamsButton from "@components/SortByParamsButton";
import { useDispatch } from "react-redux";
import {
  resetCommandState,
  openModal,
  setEditingId,
  setCommandState,
} from "@redux/commandsSlice";
import { HandleShowModalParams } from "@components/types";

interface CommandsDataProps {
  commands: ChatCommand[];
}

export default function CommandsData({ commands }: CommandsDataProps) {
  const dispatch = useDispatch();
  const deleteCommandMutation = useDeleteChatCommand();

  const handleShowModal = (params: HandleShowModalParams<ChatCommand>) => {
    dispatch(openModal());
    if (params?.type === "create") {
      dispatch(resetCommandState());

      return;
    }
    const { type, data } = params;
    if (type === "edit") dispatch(setEditingId(data._id));
    dispatch(
      setCommandState({
        ...data,
        tag: data.tag._id,
        mood: data.mood._id,
      })
    );
  };

  const handleDeleteCommand = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the command with ID: ${id}?`
      )
    )
      return;
    deleteCommandMutation.mutate(id);
  };

  return (
    <>
      <TableListWrapper
        theadChildren={
          <tr>
            <th>
              Actions
              <button
                className="common-button primary-button"
                onClick={() => {
                  handleShowModal({ type: "create" });
                }}
              >
                New
              </button>
            </th>
            <th colSpan={5}>
              <div>
                <SortByParamsButton buttonText="Name" sortBy="name" />
                <SortByParamsButton buttonText="Enabled" sortBy="enabled" />
                <SortByParamsButton buttonText="Uses" sortBy="uses" />
                <SortByParamsButton
                  buttonText="Created at"
                  sortBy="createdAt"
                />
                <SortByParamsButton buttonText="Privilege" sortBy="privilege" />
              </div>
            </th>
            <th>Aliases</th>
            <th>Messages</th>
          </tr>
        }
        tbodyChildren={commands.map((command) => {
          const { tag, mood } = command;
          return (
            <tr key={command._id}>
              <td>
                <button
                  className="common-button primary-button"
                  onClick={() => {
                    handleShowModal({ type: "duplicate", data: command });
                  }}
                >
                  Duplicate
                </button>
                <button
                  className="common-button primary-button"
                  onClick={() =>
                    handleShowModal({ type: "edit", data: command })
                  }
                >
                  Edit
                </button>
                <button
                  className="common-button danger-button"
                  onClick={() => handleDeleteCommand(command._id)}
                >
                  Delete
                </button>
              </td>
              <td colSpan={5}>
                <TableDataWrapper>
                  <div>Name: </div>
                  <div>{command.name}</div>
                  <div>Uses: </div>
                  <div>{command.uses}</div>
                  <div>Enabled: </div>
                  {generateEnabledDisabledDiv(
                    command.enabled,
                    command.enabled.toString().toUpperCase()
                  )}
                  <div>Privilege: </div>
                  <div>{command.privilege}</div>
                  <div>Tag:</div>
                  {generateEnabledDisabledDiv(tag.enabled, tag.name)}
                  <div>Mood:</div>
                  {generateEnabledDisabledDiv(mood.enabled, mood.name)}
                  <div>Created at: </div>
                  <div>
                    <DateTooltip date={command.createdAt} />
                  </div>
                  <div>Description: </div>
                  <div>{command.description}</div>
                </TableDataWrapper>
              </td>

              <td>
                <TableItemsListWrapper>
                  {command.aliases.map((alias, index) => {
                    return <div key={index}>{alias}</div>;
                  })}
                </TableItemsListWrapper>
              </td>
              <td>
                <TableItemsListWrapper>
                  {command.messages.map((message, index) => {
                    return <div key={index}>{message}</div>;
                  })}
                </TableItemsListWrapper>
              </td>
            </tr>
          );
        })}
      ></TableListWrapper>
    </>
  );
}
