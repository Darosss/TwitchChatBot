import { TableListWrapper } from "@components/tableWrapper";
import SortByParamsButton from "@components/SortByParamsButton";
import TBodyData from "./TBodyData";
import { CreateCustomAchievementButton } from "./CreateCustomAchievementButton";
import { Achievement } from "@services";

interface AchievementsListDataProps {
  achievements: Achievement[];
}

export default function AchievementsListData({
  achievements,
}: AchievementsListDataProps) {
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
        tbodyChildren={<TBodyData data={achievements} />}
      />
    </>
  );
}
