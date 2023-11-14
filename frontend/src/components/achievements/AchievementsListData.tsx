import React from "react";
import { TableListWrapper } from "@components/tableWrapper";
import SortByParamsButton from "@components/SortByParamsButton";
import { DateTooltip } from "@components/dateTooltip";
import { generateEnabledDisabledDiv } from "@utils";
import { useAchievementsListContext } from "./AchievementsContext";

export default function AchievementsListData() {
  const {
    achievementsState: { data },
  } = useAchievementsListContext();
  return (
    <>
      <TableListWrapper
        theadChildren={
          <tr>
            <th>
              <SortByParamsButton buttonText="Name" sortBy="name" />
            </th>
            <th>
              <SortByParamsButton buttonText="Enabled" sortBy="enabled" />
            </th>
            <th>
              <SortByParamsButton buttonText="Is time" sortBy="isTime" />
            </th>
            <th>
              <SortByParamsButton buttonText="Stages" sortBy="stages" />
            </th>
            <th>
              <SortByParamsButton buttonText="Tag" sortBy="tag" />
            </th>
            <th>
              <SortByParamsButton buttonText="Created At" sortBy="createdAt" />
            </th>
            <th>
              <SortByParamsButton buttonText="Updated at" sortBy="updatedAt" />
            </th>
          </tr>
        }
        tbodyChildren={data.map((achievement, index) => {
          return (
            <tr key={index} className="achievements-list-data-tbody">
              <td>{achievement.name}</td>
              <td className="achievement-list-td-condition">
                {generateEnabledDisabledDiv(
                  achievement.enabled,
                  achievement.enabled.toString().toUpperCase()
                )}
              </td>
              <td className="achievement-list-td-condition">
                {generateEnabledDisabledDiv(
                  achievement.isTime,
                  achievement.isTime.toString().toUpperCase()
                )}
              </td>
              <td>{achievement.stages.name}</td>
              <td>
                {generateEnabledDisabledDiv(
                  achievement.tag.enabled,
                  achievement.tag.name
                )}
              </td>
              <td>
                <DateTooltip date={achievement.createdAt} />
              </td>
              <td>
                <DateTooltip date={achievement.updatedAt} />
              </td>
            </tr>
          );
        })}
      />
    </>
  );
}
