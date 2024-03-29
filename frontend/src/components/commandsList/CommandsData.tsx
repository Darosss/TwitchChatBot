import React from "react";
import { generateEnabledDisabledDiv } from "@utils";
import { DateTooltip } from "@components/dateTooltip";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";
import { ChatCommand } from "@services";
import SortByParamsButton from "@components/SortByParamsButton";

interface CommandsDataProps {
  data: ChatCommand[];
  handleOnShowEditModal: (trigger: ChatCommand) => void;
  handleOnShowCreateModal: (trigger?: ChatCommand) => void;
  setCommandIdDelete: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function CommandsData({
  data,
  handleOnShowCreateModal,
  handleOnShowEditModal,
  setCommandIdDelete,
}: CommandsDataProps) {
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
            <th>
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
        tbodyChildren={data.map((command, index) => {
          const { tag, mood } = command;
          return (
            <tr key={index}>
              <td>
                <button
                  className="common-button primary-button"
                  onClick={() => handleOnShowCreateModal(command)}
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
              <td>
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
                  {command.aliases.map((alias, index) => (
                    <div key={index}>{alias}</div>
                  ))}
                </TableItemsListWrapper>
              </td>
              <td>
                <TableItemsListWrapper>
                  {command.messages.map((message, index) => (
                    <div key={index}>{message}</div>
                  ))}
                </TableItemsListWrapper>
              </td>
            </tr>
          );
        })}
      ></TableListWrapper>
    </>
  );
}
