import "./style.css";
import React from "react";
import UrlParamsInput from "@components/UrlParamsInputs";

export default function FilterBarCommands() {
  return (
    <div className="filter-commands-wrapper">
      <UrlParamsInput>
        <input
          {...{ queryparam: "search_name" }}
          type="search"
          placeholder={"Command name"}
        ></input>
        <input
          {...{ queryparam: "aliases" }}
          type="search"
          placeholder={"Aliases"}
        ></input>
        <input
          {...{ queryparam: "messages" }}
          type="search"
          placeholder={"Messages contains"}
        ></input>
        <input
          {...{ queryparam: "privilege" }}
          type="number"
          placeholder={"Search by privilege"}
        ></input>
        <input {...{ queryparam: "start_date" }} type="datetime-local"></input>
        <input {...{ queryparam: "end_date" }} type="datetime-local"></input>
      </UrlParamsInput>
    </div>
  );
}
