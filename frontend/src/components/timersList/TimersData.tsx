import React from "react";
import { Timer } from "@services";
import { generateEnabledDisabledDiv } from "@utils";
import { DateTooltip } from "@components/dateTooltip";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";
import SortByParamsButton from "@components/SortByParamsButton";

interface TimersDataProps {
  data: Timer[];
  handleOnShowEditModal: (timer: Timer) => void;
  handleOnShowCreateModal: (timer?: Timer) => void;
  setTimerIdToDelete: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function TimersData({
  data,
  handleOnShowCreateModal,
  handleOnShowEditModal,
  setTimerIdToDelete,
}: TimersDataProps) {
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
                <SortByParamsButton buttonText="Points" sortBy="points" />
                <SortByParamsButton
                  buttonText="Non follow"
                  sortBy="nonFollowMulti"
                />
                <SortByParamsButton buttonText="Non sub" sortBy="nonSubMulti" />
                <SortByParamsButton
                  buttonText="Required points"
                  sortBy="reqPoints"
                />
                <SortByParamsButton
                  buttonText="Created at"
                  sortBy="createdAt"
                />
              </div>
            </th>
            <th>Messages</th>
          </tr>
        }
        tbodyChildren={data.map((timer, index) => {
          const { tag, mood } = timer;
          return (
            <tr key={index}>
              <td>
                <div>
                  <button
                    className="common-button primary-button"
                    onClick={() => handleOnShowCreateModal(timer)}
                  >
                    Duplicate
                  </button>
                  <button
                    className="common-button primary-button"
                    onClick={() => handleOnShowEditModal(timer)}
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
              <td>
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
                  {generateEnabledDisabledDiv(
                    timer.enabled,
                    timer.enabled.toString().toUpperCase()
                  )}
                  <div>Uses: </div>
                  <div>{timer.uses}</div>
                  <div>Non follow multi: </div>
                  <div>{timer.nonFollowMulti.toString()}</div>
                  <div>Non sub multi:</div>
                  <div>{timer.nonSubMulti.toString()}</div>
                  <div>Tag:</div>
                  {generateEnabledDisabledDiv(tag.enabled, tag.name)}
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
                  {timer.messages.map((message, index) => (
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
