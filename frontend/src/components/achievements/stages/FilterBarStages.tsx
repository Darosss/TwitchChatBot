import { FilterBarInput } from "@components/urlParamsInputs";
import UrlParamsInput from "@components/urlParamsInputs/UrlParamsInputs";
import React from "react";

export default function FilterBarStages() {
  return (
    <div>
      <UrlParamsInput>
        <FilterBarInput
          queryparam="search_name"
          type="search"
          placeholder="Name"
        />
        <FilterBarInput
          queryparam="stageName"
          type="search"
          placeholder="Stage name"
        />
        <FilterBarInput queryparam="sound" type="search" placeholder="Sound" />
      </UrlParamsInput>
    </div>
  );
}
