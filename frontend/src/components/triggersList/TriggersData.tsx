import React from "react";
import { Trigger } from "@services/TriggerService";
import { generateEnabledDisabledDiv } from "@utils/generateEnabledDisabledDiv";
import { DateTooltip } from "@components/dateTooltip";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";

export default function TriggersData(props: {
  data: Trigger[];
  handleOnShowEditModal: (trigger: Trigger) => void;
  handleOnShowCreateModal: (trigger?: Trigger) => void;
  setTriggerIdDelete: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const {
    data,
    handleOnShowCreateModal,
    handleOnShowEditModal,
    setTriggerIdDelete,
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
            <th colSpan={5}>Data</th>
            <th>Words</th>
            <th>Messages</th>
          </tr>
        }
        tbodyChildren={data.map((trigger) => {
          const { tag, personality, mood } = trigger;
          return (
            <tr key={trigger._id}>
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
              <td colSpan={5}>
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
                  <div>Delay: </div>
                  <div>{trigger.delay}</div>
                  <div>Mode:</div>
                  <div>{trigger.mode}</div>
                  <div>Tag:</div>
                  {generateEnabledDisabledDiv(tag.enabled, tag.name)}
                  <div>Personality:</div>
                  {generateEnabledDisabledDiv(
                    personality.enabled,
                    personality.name
                  )}
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
                  {trigger.words.map((word, index) => {
                    return <div key={index}>{word}</div>;
                  })}
                </TableItemsListWrapper>
              </td>
              <td>
                <TableItemsListWrapper>
                  {trigger.messages.map((message, index) => {
                    return <div key={index}>{message}</div>;
                  })}
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
