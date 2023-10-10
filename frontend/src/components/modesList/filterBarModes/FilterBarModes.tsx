import React from "react";
import UrlParamsInput from "@components/urlParamsInputs";

export default function FilterBarCommands() {
  return (
    <div className="filter-commands-wrapper">
      <UrlParamsInput>
        <input
          {...{ queryparam: "search_name" }}
          type="search"
          placeholder={"Mode name"}
        ></input>
      </UrlParamsInput>
    </div>
  );
}
