import React from "react";
import { FilterBarInput } from "@components/urlParamsInputs";
import UrlParamsInput from "@components/urlParamsInputs/UrlParamsInputs";

export default function FilterBarBadges() {
  return (
    <div>
      <UrlParamsInput>
        <FilterBarInput
          queryparam="search_name"
          type="search"
          placeholder="Name"
        />
        <FilterBarInput
          queryparam="imageUrl"
          type="search"
          placeholder="Image url"
        />
      </UrlParamsInput>
    </div>
  );
}
