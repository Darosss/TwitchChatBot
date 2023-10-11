import React from "react";

import UrlParamsInput, { FilterBarInput } from "@components/urlParamsInputs";

export default function FilterBarUsers() {
  return (
    <UrlParamsInput>
      <FilterBarInput
        queryparam="search_name"
        type="search"
        placeholder="Username"
      />

      <FilterBarInput
        queryparam="privilege"
        type="number"
        placeholder="Search by privilege"
      />

      <div>
        <label>Last seen [start / end]</label>
        <div>
          <FilterBarInput id="start-seen" queryparam="seen_start" type="date" />
          <FilterBarInput
            id="seen_end-seen"
            queryparam="seen_start"
            type="date"
          />
        </div>
      </div>
      <div>
        <label>Created [start / end]</label>
        <div>
          <FilterBarInput queryparam="created_start" type="date" />
          <FilterBarInput queryparam="created_end" type="date" />
        </div>
      </div>
    </UrlParamsInput>
  );
}
