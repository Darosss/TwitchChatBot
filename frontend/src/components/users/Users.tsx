import React from "react";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import { useGetUsersList } from "@services";
import FilterBarUsers from "./filterBarUsers";
import UsersDetails from "./UsersDetails";
import { AxiosError, Loading } from "@components/axiosHelper";

export default function Users() {
  const { data: usersData, loading, error } = useGetUsersList();

  if (error) return <AxiosError error={error} />;
  if (!usersData || loading) return <Loading />;

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
