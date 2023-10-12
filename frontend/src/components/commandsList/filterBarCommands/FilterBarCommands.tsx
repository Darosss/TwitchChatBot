import React from "react";
import UrlParamsInput, { FilterBarInput } from "@components/urlParamsInputs";

export default function FilterBarCommands() {
  return (
    <div className="filter-commands-wrapper">
      <UrlParamsInput>
        <FilterBarInput
          queryparam="search_name"
          type="search"
          placeholder="Command name"
        />
        <FilterBarInput
          queryparam="aliases"
          type="search"
          placeholder="Aliases"
        />
        <FilterBarInput
          queryparam="messages"
          type="search"
          placeholder="Messages contains"
        />
        <FilterBarInput
          queryparam="privilege"
          type="number"
          placeholder="Search by privilege"
        />
        <FilterBarInput queryparam="start_date" type="datetime-local" />
        <FilterBarInput queryparam="end_date" type="datetime-local" />
      </UrlParamsInput>
    </div>
  );
}
