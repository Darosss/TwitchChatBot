import SortByParamsButton from "@components/SortByParamsButton";
import { TableListWrapper } from "@components/tableWrapper";
import TBodyManyStagesData from "./TBodyManyStagesData";
import CreateStage from "./CreateStage";

export default function AchievementStagesData() {
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
        tbodyChildren={<TBodyManyStagesData />}
      />
    </>
  );
}
