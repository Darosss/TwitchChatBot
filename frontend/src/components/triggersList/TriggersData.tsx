import { Trigger, TriggerCreateData, useDeleteTrigger } from "@services";
import { generateEnabledDisabledDiv } from "@utils";
import { DateTooltip } from "@components/dateTooltip";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";
import SortByParamsButton from "@components/SortByParamsButton";
import {
  openModal,
  resetTriggerState,
  setEditingId,
  setTriggerState,
} from "@redux/triggersSlice";
import { useDispatch } from "react-redux";
import { HandleShowModalParams } from "@components/types";

interface TriggersDataProps {
  data: Trigger[];
}

const getTriggerStateDataHelper = (trigger: Trigger): TriggerCreateData => {
  return {
    ...trigger,
    tag: trigger.tag._id,
    mood: trigger.mood._id,
  };
};

export default function TriggersData({ data }: TriggersDataProps) {
  const dispatch = useDispatch();

  const deleteTriggerMutation = useDeleteTrigger();
  const handleDeleteTrigger = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the trigger with ID: ${id}?`
      )
    )
      return;
    deleteTriggerMutation.mutate(id);
  };
  const handleShowModal = (params: HandleShowModalParams<Trigger>) => {
    dispatch(openModal());
    if (params?.type === "create") {
      dispatch(resetTriggerState());

      return;
    }
    const { type, data } = params;
    if (type === "edit") dispatch(setEditingId(data._id));
    dispatch(setTriggerState(getTriggerStateDataHelper(data)));
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
                onClick={() => handleShowModal({ type: "create" })}
              >
                New
              </button>
            </th>
            <th colSpan={5}>
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
        tbodyChildren={data.map((trigger) => {
          const { tag, mood } = trigger;
          return (
            <tr key={trigger._id}>
              <td>
                <div>
                  <button
                    className="common-button primary-button"
                    onClick={() =>
                      handleShowModal({ type: "duplicate", data: trigger })
                    }
                  >
                    Duplicate
                  </button>
                  <button
                    className="common-button primary-button"
                    onClick={() =>
                      handleShowModal({ type: "edit", data: trigger })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="common-button danger-button"
                    onClick={() => handleDeleteTrigger(trigger._id)}
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
