import { getDateFromSecondsToYMDHMS } from "@utils";
import moment from "moment";
import { useState, useCallback } from "react";

interface TimeGoalInputProps {
  goal: number;
  onChangeCallback: (value: number) => void;
}
enum CurrentInputEnum {
  SECONDS = "Seconds",
  MINUTES = "Minutes",
  HOURS = "Hours",
  DAYS = "Days",
  MONTHS = "Months",
  YEARS = "Years",
}

export function TimeGoalInput({ goal, onChangeCallback }: TimeGoalInputProps) {
  const [currentInput, setCurrentInput] = useState<CurrentInputEnum>(
    CurrentInputEnum.MINUTES
  );
  const [localGoalValue, setLocalGoalValue] = useState(goal);
  const onChangeFn = useCallback(
    (value: number) => {
      let time: moment.Moment | null = null;
      switch (currentInput) {
        case CurrentInputEnum.MINUTES:
          time = moment().add(value, "minute");
          break;
        case CurrentInputEnum.HOURS:
          time = moment().add(value, "hour");
          break;
        case CurrentInputEnum.DAYS:
          time = moment().add(value, "day");
          break;
        case CurrentInputEnum.MONTHS:
          time = moment().add(value, "month");
          break;
        case CurrentInputEnum.YEARS:
          time = moment().add(value, "year");
          break;
        default:
        case CurrentInputEnum.SECONDS:
          break;
      }

      return time ? Math.round(time.diff(moment()) / 1000) : value;
    },
    [currentInput]
  );
  return (
    <>
      <div>Time in</div>
      <div>
        <select
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value as CurrentInputEnum)}
        >
          <option id={`${CurrentInputEnum.SECONDS}`}>
            {CurrentInputEnum.SECONDS}
          </option>
          <option id={`${CurrentInputEnum.MINUTES}`}>
            {CurrentInputEnum.MINUTES}
          </option>
          <option id={`${CurrentInputEnum.HOURS}`}>
            {CurrentInputEnum.HOURS}
          </option>
          <option id={`${CurrentInputEnum.DAYS}`}>
            {CurrentInputEnum.DAYS}
          </option>
          <option id={`${CurrentInputEnum.MONTHS}`}>
            {CurrentInputEnum.MONTHS}
          </option>
          <option id={`${CurrentInputEnum.YEARS}`}>
            {CurrentInputEnum.YEARS}
          </option>
        </select>
      </div>
      <div>Goal</div>
      <div>
        <input
          type="number"
          onChange={(e) => setLocalGoalValue(e.target.valueAsNumber)} //onChangeCallback(onChangeFn(e.target.valueAsNumber))}
          onBlur={() => onChangeCallback(onChangeFn(localGoalValue))}
          value={localGoalValue}
        />
      </div>
      <div>Preview</div>

      <div>{getDateFromSecondsToYMDHMS(onChangeFn(localGoalValue))}</div>
    </>
  );
}

//
