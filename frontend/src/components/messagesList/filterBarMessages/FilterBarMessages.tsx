import React from "react";

import UrlParamsInput, { FilterBarInput } from "@components/urlParamsInputs";

export default function FilterBarMessages() {
  return (
    <div className="filter-messages-wrapper">
      <UrlParamsInput>
        <FilterBarInput
          queryparam="search_name"
          type="search"
          placeholder="Message contains"
        />
        <FilterBarInput
          queryparam="owner"
          type="search"
          placeholder="Owner of message"
        />
        <div>
          <label> Date [start / end]</label>
          <div>
            <FilterBarInput queryparam="start_date" type="datetime-local" />
            <FilterBarInput queryparam="end_date" type="datetime-local" />
          </div>
        </div>
      </UrlParamsInput>
    </div>
  );
}
