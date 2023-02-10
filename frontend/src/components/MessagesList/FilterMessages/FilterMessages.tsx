import "./style.css";
import React from "react";
import { useSearchParams } from "react-router-dom";

export default function Message(props: {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramsNames = {
    name: "search_name",
    owner: "owner",
    startDate: "start_date",
    endDate: "end_date",
  };

  const onBlurOrKeySearchParamsChange = (queryName: string, value: string) => {
    setSearchParams((prevState) => {
      if (value) {
        prevState.set(queryName, value);
      } else {
        prevState.delete(queryName);
      }
      return prevState;
    });
  };

  const onKeyDownInput = (key: string, queryString: string, value: string) => {
    if (key === "Enter") {
      onBlurOrKeySearchParamsChange(queryString, value);
    }
  };

  const clearFilters = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const inputs = e.currentTarget.parentElement?.querySelectorAll("input");
    inputs?.forEach((input) => {
      input.value = "";
    });
    setSearchParams("");
  };

  return (
    <div className="filter-messages">
      <button
        onClick={(e) => {
          clearFilters(e);
        }}
      >
        Clear filters
      </button>
      <div className="filter-messages-inputs">
        <input
          type="text"
          placeholder={"Message contains"}
          defaultValue={searchParams.get(paramsNames.name) || ""}
          onBlur={(e) =>
            onBlurOrKeySearchParamsChange(paramsNames.name, e.target.value)
          }
          onKeyDown={(e) =>
            onKeyDownInput(e.key, paramsNames.name, e.currentTarget.value)
          }
        />
        <input
          type="text"
          placeholder={"Message of user"}
          defaultValue={searchParams.get(paramsNames.owner) || ""}
          onBlur={(e) =>
            onBlurOrKeySearchParamsChange(paramsNames.owner, e.target.value)
          }
          onKeyDown={(e) =>
            onKeyDownInput(e.key, paramsNames.owner, e.currentTarget.value)
          }
        />
        <input
          type="datetime-local"
          defaultValue={searchParams.get(paramsNames.startDate) || ""}
          onBlur={(e) =>
            onBlurOrKeySearchParamsChange(paramsNames.startDate, e.target.value)
          }
          onKeyDown={(e) =>
            onKeyDownInput(e.key, paramsNames.startDate, e.currentTarget.value)
          }
        />
        <input
          type="datetime-local"
          defaultValue={searchParams.get(paramsNames.endDate) || ""}
          onBlur={(e) =>
            onBlurOrKeySearchParamsChange(paramsNames.endDate, e.target.value)
          }
          onKeyDown={(e) =>
            onKeyDownInput(e.key, paramsNames.endDate, e.currentTarget.value)
          }
        />
      </div>
    </div>
  );
}
