import SortByParamsButton from "@components/SortByParamsButton";
import { TableListWrapper } from "@components/tableWrapper";
import TBodyManyStagesData from "./TBodyManyStagesData";
import CreateStage from "./CreateStage";
import { AchievementStage } from "@services";

interface AchievementStagesDataProps {
  data: AchievementStage[];
}

export default function AchievementStagesData({
  data,
}: AchievementStagesDataProps) {
  return (
    <>
      <TableListWrapper
        theadChildren={
          <tr>
            <th>
              Actions
              <CreateStage />
            </th>
            <th>
              <SortByParamsButton buttonText="Name" sortBy="name" />
            </th>
            <th>
              <SortByParamsButton buttonText="Created At" sortBy="createdAt" />
            </th>
            <th>
              <SortByParamsButton buttonText="Updated at" sortBy="updatedAt" />
            </th>
          </tr>
        }
        tbodyChildren={<TBodyManyStagesData data={data} />}
      />
    </>
  );
}
