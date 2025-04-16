import { useEffect, useState } from "react";

interface UseTimerProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

export const useTimer = ({
  currentTime,
  duration,
  isPlaying,
}: UseTimerProps) => {
  const [progressTimer, setProgressTimer] = useState<NodeJS.Timeout>();
  const [timer, setTimer] = useState(0);

  const countTime = (newDuration: number) =>
    setTimer((prev) => {
      const newTime = prev + 1 > newDuration ? newDuration : prev + 1;
      return newTime;
    });

  useEffect(() => {
    setTimer(currentTime);

    //TODO: added duration for forcing setTimer (mostly duration will be different in each songs)
  }, [currentTime, duration]);

  useEffect(() => {
    clearInterval(progressTimer);
    if (!isPlaying) return;

    setProgressTimer(
      setInterval(() => {
        countTime(duration);
      }, 1000)
    );

    return () => {
      clearInterval(progressTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, isPlaying]);

  useEffect(() => {
    return () => {
      clearInterval(progressTimer);
    };
  }, [progressTimer]);
  return timer;
};
