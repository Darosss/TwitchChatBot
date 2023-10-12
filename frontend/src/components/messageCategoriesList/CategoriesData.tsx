import React from "react";
import { generateEnabledDisabledDiv } from "@utils";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";
import { MessageCategory } from "@services";
import SortByParamsButton from "@components/SortByParamsButton";

interface CategoriesDataProps {
  data: MessageCategory[];
  handleOnShowEditModal: (category: MessageCategory) => void;
  handleOnShowCreateModal: (category?: MessageCategory) => void;
  setCategoryIdToDelete: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function CategoriesData({
  data,
  handleOnShowCreateModal,
  handleOnShowEditModal,
  setCategoryIdToDelete,
}: CategoriesDataProps) {
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
              </div>
            </th>
            <th>Messages</th>
          </tr>
        }
        tbodyChildren={data.map((category, index) => {
          const { tag, mood } = category;
          return (
            <tr key={index}>
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
              <td>
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
                  <div>Mood:</div>
                  {generateEnabledDisabledDiv(mood.enabled, mood.name)}
                </TableDataWrapper>
              </td>
              <td>
                <TableItemsListWrapper>
                  {category.messages.map((message, index) => (
                    <div key={index}>
                      {message[0]} - uses: {message[1]}
                    </div>
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
