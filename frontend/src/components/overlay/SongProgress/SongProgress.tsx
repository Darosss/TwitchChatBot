import React from "react";
import { convertSecondsToMS } from "@utils/convertSecondsToMS";
import ProgressBar, { ProgressBarProps } from "@ramonak/react-progress-bar";

interface SongProgressProps {
  songDuration: number;
  currentTime: number;
  progressBarProps?: Partial<ProgressBarProps>;
}
export default function SongProgress({
  songDuration,
  currentTime,
  progressBarProps,
}: SongProgressProps) {
  const [maxMinutes, maxSeconds] = convertSecondsToMS(songDuration);
  const [currMinutes, currSeconds] = convertSecondsToMS(currentTime);

  return (
    <>
      <ProgressBar
        completed={currentTime}
        maxCompleted={songDuration}
        customLabel={` ${currMinutes}:${currSeconds} / ${maxMinutes}:${maxSeconds}`}
        labelAlignment="outside"
        labelSize="100%"
        width={"70%"}
        height="1rem"
        bgColor={"lightblue"}
        {...progressBarProps}
      />
    </>
  );
}
