import { viteBackendUrl } from "@configs";
import { SocketContexType } from "@socket";
import {
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
} from "@socketTypes";
import { useCallback, useEffect, useRef, useState } from "react";

type AchievementData = {
  audioUrl?: string;
  delay?: number;
};

type Options = {
  enabled: boolean;
  getAudioAndDelay: (
    data:
      | ObtainAchievementDataWithCollectedAchievement
      | ObtainAchievementDataWithProgressOnly
  ) => AchievementData;
};

export const useAchievementQueue = (
  socket: SocketContexType | null,
  setObtainedAchievements: (
    cb: (
      prev: (
        | ObtainAchievementDataWithCollectedAchievement
        | ObtainAchievementDataWithProgressOnly
      )[]
    ) => (
      | ObtainAchievementDataWithCollectedAchievement
      | ObtainAchievementDataWithProgressOnly
    )[]
  ) => void,
  options: Options
) => {
  const [start, setStart] = useState(new Date().getTime());
  const [end, setEnd] = useState(new Date().getTime() + 2500);
  const queue = useRef<
    (
      | ObtainAchievementDataWithCollectedAchievement
      | ObtainAchievementDataWithProgressOnly
    )[]
  >([]);
  const isProcessing = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const processNext = useCallback(async () => {
    if (queue.current.length === 0 || isProcessing.current) return;
    isProcessing.current = true;

    const data = queue.current.shift();
    if (!data) {
      isProcessing.current = false;
      return;
    }
    setObtainedAchievements((prev) => [data, ...prev]);

    const { audioUrl, delay = 2500 } = options.getAudioAndDelay(data);
    const startTime = new Date().getTime();
    setStart(startTime);
    setEnd(startTime + delay);
    if (options.enabled && audioUrl) {
      const audio = new Audio(`${viteBackendUrl}/${audioUrl}`);
      audio.volume = 0.05;
      audioRef.current = audio;

      await audio.play();
    }

    setTimeout(() => {
      audioRef.current?.pause();

      isProcessing.current = false;
      processNext();
    }, delay);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    const handler = (
      data:
        | ObtainAchievementDataWithCollectedAchievement
        | ObtainAchievementDataWithProgressOnly
    ) => {
      queue.current.push(data);

      processNext();
    };

    socket?.events?.obtainAchievement.on(handler);

    return () => {
      socket?.events?.obtainAchievement.off();
    };
  }, [socket?.events, options.enabled, processNext]);

  return { start, end, isActive: isProcessing.current };
};
