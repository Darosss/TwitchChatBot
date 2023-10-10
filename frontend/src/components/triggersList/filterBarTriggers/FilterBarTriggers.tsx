import React from "react";
import UrlParamsInput from "@components/urlParamsInputs";

export default function FilterBarCommands() {
  return (
    <div className="filter-commands-wrapper">
      <UrlParamsInput>
        <input
          {...{ queryparam: "search_name" }}
          type="search"
          placeholder={"Trigger name"}
        ></input>
        <input
          {...{ queryparam: "words" }}
          type="search"
          placeholder={"Words"}
        ></input>
        <input
          {...{ queryparam: "messages" }}
          type="search"
          placeholder={"Messages"}
        ></input>

        <input {...{ queryparam: "start_date" }} type="datetime-local"></input>
        <input {...{ queryparam: "end_date" }} type="datetime-local"></input>
      </UrlParamsInput>
    </div>
  );
}
