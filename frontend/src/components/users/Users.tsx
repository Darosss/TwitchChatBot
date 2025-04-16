import React from "react";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import { fetchUsersDefaultParams, useGetUsers } from "@services";
import FilterBarUsers from "./filterBarUsers";
import UsersDetails from "./UsersDetails";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";

export default function Users() {
  const searchParams = useQueryParams(fetchUsersDefaultParams);
  const { data: usersData, isLoading, error } = useGetUsers(searchParams);

  if (error) return <Error error={error} />;
  if (!usersData || isLoading) return <Loading />;

  const { data, count, currentPage } = usersData;
  return (
    <>
      <PreviousPage />
      <FilterBarUsers />
      <div id="users-list" className="table-list-wrapper">
        <UsersDetails users={data} />
      </div>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={count}
          localStorageName="usersPageSize"
          siblingCount={1}
        />
      </div>
    </>
  );
}
