import React from "react";

import UrlParamsInput, { FilterBarInput } from "@components/urlParamsInputs";

export default function FilterBarAchievements() {
  return (
    <div>
      <UrlParamsInput>
        <FilterBarInput
          queryparam="search_name"
          type="search"
          placeholder="Name"
        />
      </UrlParamsInput>
    </div>
  );
}
