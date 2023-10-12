import React from "react";

import UrlParamsInput, { FilterBarInput } from "@components/urlParamsInputs";

export default function FilterBarRedemptions() {
  return (
    <div className="filter-redemptions-wrapper">
      <UrlParamsInput>
        <FilterBarInput
          queryparam="search_name"
          type="search"
          placeholder="Reward name"
        />

        <FilterBarInput
          queryparam="receiver"
          type="search"
          placeholder="Receiver"
        />
        <div>
          <label> Redemption date [ start / end ]</label>
          <div>
            <FilterBarInput queryparam="start_date" type="datetime-local" />
            <FilterBarInput queryparam="end_date" type="datetime-local" />
          </div>
        </div>
        <FilterBarInput queryparam="cost" type="number" placeholder="Cost" />
        <FilterBarInput
          queryparam="message"
          type="search"
          placeholder="Message contain"
        />
      </UrlParamsInput>
    </div>
  );
}
