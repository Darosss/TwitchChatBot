import React from "react";
import { Trigger } from "@services";
import { generateEnabledDisabledDiv } from "@utils";
import { DateTooltip } from "@components/dateTooltip";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";
import SortByParamsButton from "@components/SortByParamsButton";

interface TriggersDataProps {
  data: Trigger[];
  handleOnShowEditModal: (trigger: Trigger) => void;
  handleOnShowCreateModal: (trigger?: Trigger) => void;
  setTriggerIdDelete: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function TriggersData({
  data,
  handleOnShowCreateModal,
  handleOnShowEditModal,
  setTriggerIdDelete,
}: TriggersDataProps) {
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
                <SortByParamsButton buttonText="Delay" sortBy="delay" />
                <SortByParamsButton buttonText="Mode" sortBy="mode" />
                <SortByParamsButton
                  buttonText="Created at"
                  sortBy="createdAt"
                />
              </div>
            </th>
            <th>Words</th>
            <th>Messages</th>
          </tr>
        }
        tbodyChildren={data.map((trigger, index) => {
          const { tag, mood } = trigger;
          return (
            <tr key={index}>
              <td>
                <div>
                  <button
                    className="common-button primary-button"
                    onClick={() => {
                      handleOnShowCreateModal(trigger);
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    className="common-button primary-button"
                    onClick={() => {
                      handleOnShowEditModal(trigger);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="common-button danger-button"
                    onClick={() => setTriggerIdDelete(trigger._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
              <td>
                <TableDataWrapper>
                  <div>Name: </div>
                  <div>{trigger.name}</div>
                  <div>Chance: </div>
                  <div>{trigger.chance}</div>
                  <div>Enabled: </div>
                  {generateEnabledDisabledDiv(
                    trigger.enabled,
                    trigger.enabled.toString().toUpperCase()
                  )}
                  <div>Delay: </div>
                  <div>{trigger.delay}</div>
                  <div>Uses: </div>
                  <div>{trigger.uses}</div>
                  <div>Mode:</div>
                  <div>{trigger.mode}</div>
                  <div>Tag:</div>
                  {generateEnabledDisabledDiv(tag.enabled, tag.name)}
                  <div>Mood:</div>
                  {generateEnabledDisabledDiv(mood.enabled, mood.name)}
                  <div>Created at:</div>
                  <div>
                    <DateTooltip date={trigger.createdAt} />
                  </div>
                </TableDataWrapper>
              </td>
              <td>
                <TableItemsListWrapper>
                  {trigger.words.map((word, index) => (
                    <div key={index}>{word}</div>
                  ))}
                </TableItemsListWrapper>
              </td>
              <td>
                <TableItemsListWrapper>
                  {trigger.messages.map((message, index) => (
                    <div key={index}>{message}</div>
                  ))}
                </TableItemsListWrapper>
              </td>
              <td></td>
            </tr>
          );
        })}
      ></TableListWrapper>
    </>
  );
}
