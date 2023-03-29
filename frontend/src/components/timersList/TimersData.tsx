import React from "react";
import { Timer } from "@services/TimerService";
import { generateEnabledDisabledDiv } from "@utils/generateEnabledDisabledDiv";
import { DateTooltip } from "@components/dateTooltip";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";

export default function TimersData(props: {
  data: Timer[];
  handleOnShowEditModal: (timer: Timer) => void;
  handleOnShowCreateModal: (timer?: Timer) => void;
  setTimerIdToDelete: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const {
    data,
    handleOnShowCreateModal,
    handleOnShowEditModal,
    setTimerIdToDelete,
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
            <th>Messages</th>
          </tr>
        }
        tbodyChildren={data.map((timer) => {
          const { tag, personality, mood } = timer;
          return (
            <tr key={timer._id}>
              <td>
                <div>
                  <button
                    className="common-button primary-button"
                    onClick={() => {
                      handleOnShowCreateModal(timer);
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    className="common-button primary-button"
                    onClick={() => {
                      handleOnShowEditModal(timer);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="common-button danger-button"
                    onClick={() => setTimerIdToDelete(timer._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
              <td colSpan={5}>
                <TableDataWrapper>
                  <div>Name: </div>
                  <div>{timer.name}</div>
                  <div>Delay: </div>
                  <div>{timer.delay}</div>
                  <div>Points: </div>
                  <div>{timer.points}</div>
                  <div>Required points: </div>
                  <div>{timer.reqPoints}</div>
                  <div>Enabled: </div>
                  <div
                    style={{
                      background: `${timer.enabled ? "green" : "red"}`,
                    }}
                  >
                    {timer.enabled.toString()}
                  </div>
                  <div>Uses: </div>
                  <div>{timer.uses}</div>
                  <div>Non follow multi: </div>
                  <div>{timer.nonFollowMulti.toString()}</div>
                  <div>Non sub multi:</div>
                  <div>{timer.nonSubMulti.toString()}</div>
                  <div>Tag:</div>
                  {generateEnabledDisabledDiv(tag.enabled, tag.name)}
                  <div>Personality:</div>
                  {generateEnabledDisabledDiv(
                    personality.enabled,
                    personality.name
                  )}
                  <div>Mood:</div>
                  {generateEnabledDisabledDiv(mood.enabled, mood.name)}
                  <div>Description:</div>
                  <div>{timer.description}</div>
                  <div>Created at:</div>
                  <div>
                    <DateTooltip date={timer.createdAt} />
                  </div>
                </TableDataWrapper>
              </td>
              <td>
                <TableItemsListWrapper>
                  {timer.messages.map((message, index) => {
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
