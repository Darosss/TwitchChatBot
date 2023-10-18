import React from "react";

import UrlParamsInput, { FilterBarInput } from "@components/urlParamsInputs";

export default function FilterBarRedemptions() {
  return (
    <div className="filter-redemptions-wrapper">
      <UrlParamsInput>
        <FilterBarInput
          queryparam="search_name"
          type="search"
          placeholder="Song title"
        />
        <FilterBarInput
          queryparam="customId"
          type="search"
          placeholder="Custom id"
        />
        <div>
          <label> Created between [ start / end ]</label>
          <div>
            <FilterBarInput queryparam="start_date" type="datetime-local" />
            <FilterBarInput queryparam="end_date" type="datetime-local" />
          </div>
        </div>
      </UrlParamsInput>
    </div>
  );
}
