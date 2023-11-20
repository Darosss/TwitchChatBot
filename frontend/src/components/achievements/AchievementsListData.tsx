import React from "react";
import { TableListWrapper } from "@components/tableWrapper";
import SortByParamsButton from "@components/SortByParamsButton";
import TBodyData from "./TBodyData";
import { CreateCustomAchievementButton } from "./CreateCustomAchievementButton";

export default function AchievementsListData() {
  return (
    <>
      <TableListWrapper
        theadChildren={
          <tr>
            <th>
              Actions
              <CreateCustomAchievementButton />
            </th>
            <th>
              <div>
                <SortByParamsButton buttonText="Name" sortBy="name" />
                <SortByParamsButton buttonText="Enabled" sortBy="enabled" />
                <SortByParamsButton buttonText="Is time" sortBy="isTime" />
              </div>
            </th>
            <th>
              <div>
                <SortByParamsButton buttonText="Stages" sortBy="stages" />
                <SortByParamsButton buttonText="Tag" sortBy="tag" />
                <SortByParamsButton buttonText="Custom" sortBy="custom" />
                <SortByParamsButton buttonText="Hidden" sortBy="hidden" />
              </div>
            </th>
            <th>
              <div>
                <SortByParamsButton
                  buttonText="Created At"
                  sortBy="createdAt"
                />
                <SortByParamsButton
                  buttonText="Updated at"
                  sortBy="updatedAt"
                />
              </div>
            </th>
          </tr>
        }
        tbodyChildren={<TBodyData />}
      />
    </>
  );
}
