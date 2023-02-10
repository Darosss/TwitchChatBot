import "./style.css";
import React from "react";
import UrlParamsInput from "@components/UrlParamsInputs";

export default function FilterBarUsers() {
  return (
    <div className="filter-users-wrapper">
      <UrlParamsInput>
        <input
          {...{ queryparam: "search_name" }}
          type="search"
          placeholder={"Username"}
        ></input>

        <input
          {...{ queryparam: "privilege" }}
          type="number"
          placeholder={"Search by privilege"}
        ></input>
        <label>Last seen</label>
        <input
          {...{ queryparam: "seen_start" }}
          id="start-seen"
          type="date"
        ></input>
        <input {...{ queryparam: "seen_end" }} type="date"></input>

        <label>Created</label>
        <input
          {...{ queryparam: "created_start" }}
          id="start-seen"
          type="date"
        ></input>
        <input {...{ queryparam: "created_end" }} type="date"></input>
      </UrlParamsInput>
    </div>
  );
}
