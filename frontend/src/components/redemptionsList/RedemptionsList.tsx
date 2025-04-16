import Pagination from "@components/pagination";
import { Link, useParams } from "react-router-dom";
import PreviousPage from "@components/previousPage";
import FilterBarRedemptions from "./filterBarRedemptions";
import {
  useGetRedemptions,
  Redemption,
  PaginationData,
  useGetUserRedemptions,
  useGetSessionRedemptions,
  fetchRedemptionsDefaultParams,
} from "@services";
import { DateTooltip } from "@components/dateTooltip";
import SortByParamsButton from "@components/SortByParamsButton";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";

interface RedemptionsListProps {
  redemptions: "all" | "session" | "user";
}

interface RedemptionsDetailProps {
  redemptions: Redemption[];
}

interface RedemptionsProps {
  redemptionsData: PaginationData<Redemption>;
}

export default function RedemptionsList({ redemptions }: RedemptionsListProps) {
  switch (redemptions) {
    case "user":
      return <RedemptionsUser />;
    case "session":
      return <RedemptionsSession />;
    case "all":
    default:
      return <RedemptionsAll />;
  }
}

//TODO: add query params to user/session based

const RedemptionsUser = () => {
  const { userId } = useParams();
  const { data, isLoading, error } = useGetUserRedemptions(userId!);
  if (error) return <Error error={error} />;
  if (!data || isLoading) return <Loading />;

  return <Redemptions redemptionsData={data} />;
};

const RedemptionsSession = () => {
  const { sessionId } = useParams();
  const { data, isLoading, error } = useGetSessionRedemptions(sessionId!);
  if (error) return <Error error={error} />;
  if (!data || isLoading) return <Loading />;

  return <Redemptions redemptionsData={data} />;
};

const RedemptionsAll = () => {
  const queryParms = useQueryParams(fetchRedemptionsDefaultParams);
  const { data, isLoading, error } = useGetRedemptions(queryParms);
  if (error) return <Error error={error} />;
  if (!data || isLoading) return <Loading />;

  return <Redemptions redemptionsData={data} />;
};

const RedemptionsDetails = ({ redemptions }: RedemptionsDetailProps) => (
  <table id="table-redemptions-list">
    <thead>
      <tr>
        <th>
          <SortByParamsButton buttonText="Reward name" sortBy="rewardTitle" />
        </th>
        <th>
          <SortByParamsButton buttonText="Receiver" sortBy="userName" />
        </th>
        <th>
          <SortByParamsButton buttonText="Date" sortBy="redemptionDate" />
        </th>
        <th>
          <SortByParamsButton buttonText="Cost" sortBy="rewardCost" />
        </th>
        <th>
          <SortByParamsButton buttonText="Message" sortBy="message" />
        </th>
      </tr>
    </thead>

    <tbody>
      {redemptions.map((redemption, index) => (
        <tr key={index}>
          <td className="redemptions-list-name">{redemption.rewardTitle}</td>
          <td>
            <Link to={`/users/${redemption.userId}`}>
              {redemption.userName}
            </Link>
          </td>
          <td className="redemptions-list-date">
            <DateTooltip date={redemption.redemptionDate} />
          </td>
          <td>{redemption.rewardCost}</td>
          <td>{redemption.message}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Redemptions = ({
  redemptionsData: { data, count, currentPage },
}: RedemptionsProps) => {
  return (
    <>
      <PreviousPage />
      <FilterBarRedemptions />

      <div id="redemptions-list" className="table-list-wrapper">
        <RedemptionsDetails redemptions={data} />
      </div>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={count}
          localStorageName="redemptionsListPageSize"
          siblingCount={1}
        />
      </div>
    </>
  );
};
