import { convertSecondsToMS } from "@utils";
import ProgressBar, { ProgressBarProps } from "@ramonak/react-progress-bar";
import { useTimer } from "@hooks/useTimer";

interface SongProgressProps {
  songDuration: number;
  currentTime: number;
  progressBarProps?: Partial<ProgressBarProps>;
}
export default function SongProgress(props: SongProgressProps) {
  const { songDuration, currentTime, progressBarProps } = props;
  const timer = useTimer({
    currentTime: currentTime,
    duration: songDuration,
    isPlaying: songDuration > 0,
  });

  const [maxMinutes, maxSeconds] = convertSecondsToMS(songDuration);
  const [currMinutes, currSeconds] = convertSecondsToMS(timer);

  return (
    <>
      <ProgressBar
        completed={timer}
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
