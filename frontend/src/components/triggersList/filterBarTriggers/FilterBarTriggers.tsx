import React from "react";
import UrlParamsInput, { FilterBarInput } from "@components/urlParamsInputs";

export default function FilterBarCommands() {
  return (
    <div className="filter-commands-wrapper">
      <UrlParamsInput>
        <FilterBarInput
          queryparam="search_name"
          type="search"
          placeholder="Trigger name"
        />
        <FilterBarInput queryparam="words" type="search" placeholder="Words" />
        <FilterBarInput
          queryparam="messages"
          type="search"
          placeholder="Messages"
        />
        <FilterBarInput queryparam="start_date" type="datetime-local" />
        <FilterBarInput queryparam="end_date" type="datetime-local" />
      </UrlParamsInput>
    </div>
  );
}
