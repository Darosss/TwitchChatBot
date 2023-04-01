import React from "react";
import { generateEnabledDisabledDiv } from "@utils/generateEnabledDisabledDiv";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";
import { MessageCategory } from "@services/MessageCategoriesService";
import SortByParamsButton from "@components/SortByParamsButton";

export default function CategoriesData(props: {
  data: MessageCategory[];
  handleOnShowEditModal: (category: MessageCategory) => void;
  handleOnShowCreateModal: (category?: MessageCategory) => void;
  setCategoryIdToDelete: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const {
    data,
    handleOnShowCreateModal,
    handleOnShowEditModal,
    setCategoryIdToDelete,
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
              </div>
            </th>
            <th>Messages</th>
          </tr>
        }
        tbodyChildren={data.map((category) => {
          const { tag, personality, mood } = category;
          return (
            <tr key={category._id}>
              <td>
                <div>
                  <button
                    className="common-button primary-button"
                    onClick={() => {
                      handleOnShowEditModal(category);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="common-button primary-button"
                    onClick={() => {
                      handleOnShowCreateModal(category);
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    className="common-button danger-button"
                    onClick={() => setCategoryIdToDelete(category._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
              <td colSpan={5}>
                <TableDataWrapper>
                  <div>Name</div>
                  <div>{category.name}</div>
                  <div>Enabled</div>
                  {generateEnabledDisabledDiv(
                    category.enabled,
                    category.enabled.toString().toUpperCase()
                  )}
                  <div>Uses</div>
                  <div>{category.uses}</div>
                  <div>Tag:</div>
                  {generateEnabledDisabledDiv(tag.enabled, tag.name)}
                  <div>Personality:</div>
                  {generateEnabledDisabledDiv(
                    personality.enabled,
                    personality.name
                  )}
                  <div>Mood:</div>
                  {generateEnabledDisabledDiv(mood.enabled, mood.name)}
                </TableDataWrapper>
              </td>
              <td>
                <TableItemsListWrapper>
                  {category.messages.map((message, index) => {
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
