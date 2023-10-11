import React from "react";
import UrlParamsInput, { FilterBarInput } from "@components/urlParamsInputs";

export default function FilterBarSessions() {
  return (
    <div className="filter-users-wrapper">
      <UrlParamsInput>
        <FilterBarInput
          queryparam="search_name"
          type="search"
          placeholder="Title"
        />
        <FilterBarInput queryparam="tags" type="search" placeholder="Tags" />
        <FilterBarInput
          queryparam="categories"
          type="search"
          placeholder="Categories"
        />
        <div>
          <label>Session date [start / end ] </label>
          <div>
            <FilterBarInput
              id="start-seen"
              queryparam="start_date"
              type="date"
            />
            <FilterBarInput queryparam="end_date" type="date" />
          </div>
        </div>
      </UrlParamsInput>
    </div>
  );
}
