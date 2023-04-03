import "./style.css";
import React from "react";

import UrlParamsInput from "@components/urlParamsInputs";

export default function FilterBarUsers() {
  return (
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
      <div>
        <label>Last seen [start / end]</label>
        <div>
          <input
            {...{ queryparam: "seen_start" }}
            id="start-seen"
            type="date"
          ></input>
          <input {...{ queryparam: "seen_end" }} type="date"></input>
        </div>
      </div>
      <div>
        <label>Created [start / end]</label>
        <div>
          <input
            {...{ queryparam: "created_start" }}
            id="start-seen"
            type="date"
          ></input>
          <input {...{ queryparam: "created_end" }} type="date"></input>
        </div>
      </div>
    </UrlParamsInput>
  );
}
