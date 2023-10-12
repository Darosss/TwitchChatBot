import React from "react";
import UrlParamsInput, { FilterBarInput } from "@components/urlParamsInputs";

export default function FilterBarTimers() {
  return (
    <div className="filter-commands-wrapper">
      <UrlParamsInput>
        <FilterBarInput
          queryparam="search_name"
          type="search"
          placeholder="Timer name"
        />
        <FilterBarInput
          queryparam="messages"
          type="search"
          placeholder="Messages"
        />
      </UrlParamsInput>
    </div>
  );
}
