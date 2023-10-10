import React from "react";

import UrlParamsInput from "@components/urlParamsInputs";

export default function FilterBarMessages() {
  return (
    <div className="filter-messages-wrapper">
      <UrlParamsInput>
        <input
          {...{ queryparam: "search_name" }}
          type="search"
          placeholder={"Message contains"}
        ></input>
        <input
          {...{ queryparam: "owner" }}
          type="search"
          placeholder={"Owner of message"}
        ></input>
        <div>
          <label> Date [start / end]</label>
          <div>
            <input
              {...{ queryparam: "start_date" }}
              type="datetime-local"
            ></input>
            <input
              {...{ queryparam: "end_date" }}
              type="datetime-local"
            ></input>
          </div>
        </div>
      </UrlParamsInput>
    </div>
  );
}
