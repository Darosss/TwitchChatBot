import React from "react";
import UrlParamsInput, { FilterBarInput } from "@components/urlParamsInputs";

export default function FilterBarCommands() {
  return (
    <div className="filter-commands-wrapper">
      <UrlParamsInput>
        <FilterBarInput
          queryparam="search_name"
          type="search"
          placeholder="Mode name"
        />
      </UrlParamsInput>
    </div>
  );
}
