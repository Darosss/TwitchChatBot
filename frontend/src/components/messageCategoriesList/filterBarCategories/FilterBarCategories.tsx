import React from "react";

import UrlParamsInput, { FilterBarInput } from "@components/urlParamsInputs";

export default function filterBarCategories() {
  return (
    <div className="filter-message-categories-wrapper">
      <UrlParamsInput>
        <FilterBarInput
          queryparam="category"
          type="search"
          placeholder="Category contains"
        />
        <FilterBarInput
          queryparam="messages"
          type="search"
          placeholder="Messages contain"
        />
      </UrlParamsInput>
    </div>
  );
}
