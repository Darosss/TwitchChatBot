import React from "react";
import { generateEnabledDisabledDiv } from "@utils/generateEnabledDisabledDiv";
import { DateTooltip } from "@components/dateTooltip";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";
import { ChatCommand } from "@services/ChatCommandService";
import SortByParamsButton from "@components/SortByParamsButton";

export default function CommandsData(props: {
  data: ChatCommand[];
  handleOnShowEditModal: (trigger: ChatCommand) => void;
  handleOnShowCreateModal: (trigger?: ChatCommand) => void;
  setCommandIdDelete: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const {
    data,
    handleOnShowCreateModal,
    handleOnShowEditModal,
    setCommandIdDelete,
  } = props;
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
        tbodyChildren={data.map((command) => {
          const { tag, personality, mood } = command;
          return (
            <tr key={command._id}>
              <td>
                <button
                  className="common-button primary-button"
                  onClick={() => {
                    handleOnShowCreateModal(command);
                  }}
                >
                  Duplicate
                </button>
                <button
                  className="common-button primary-button"
                  onClick={() => handleOnShowEditModal(command)}
                >
                  Edit
                </button>
                <button
                  className="common-button danger-button"
                  onClick={() => setCommandIdDelete(command._id)}
                >
                  Delete
                </button>
              </td>
              <td colSpan={5}>
                <TableDataWrapper>
                  <div>Name: </div>
                  <div>{command.name}</div>
                  <div>Uses: </div>
                  <div>{command.useCount}</div>
                  <div>Enabled: </div>
                  <div
                    style={{
                      background: `${command.enabled ? "green" : "red"}`,
                    }}
                  >
                    {command.enabled.toString()}
                  </div>
                  <div>Privilege: </div>
                  <div>{command.privilege}</div>
                  <div>Tag:</div>
                  {generateEnabledDisabledDiv(tag.enabled, tag.name)}
                  <div>Personality:</div>
                  {generateEnabledDisabledDiv(
                    personality.enabled,
                    personality.name
                  )}
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
