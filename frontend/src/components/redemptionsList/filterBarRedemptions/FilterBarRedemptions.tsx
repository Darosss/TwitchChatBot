import "./style.css";
import React from "react";
import UrlParamsInput from "@components/UrlParamsInputs";

export default function FilterBarRedemptions() {
  return (
    <div className="filter-redemptions-wrapper">
      <UrlParamsInput>
        <input
          {...{ queryparam: "search_name" }}
          type="search"
          placeholder={"Rward name"}
        ></input>
        <input
          {...{ queryparam: "receiver" }}
          type="search"
          placeholder={"Receiver"}
        ></input>
        <input {...{ queryparam: "start_date" }} type="datetime-local"></input>
        <input {...{ queryparam: "end_date" }} type="datetime-local"></input>
        <input
          {...{ queryparam: "cost" }}
          placeholder={"Cost"}
          type="number"
        ></input>
        <input
          {...{ queryparam: "message" }}
          placeholder={"Message contains"}
          type="search"
        ></input>
      </UrlParamsInput>
    </div>
  );
}
