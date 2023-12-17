import { Request, Response } from "express";
import ytdl from "ytdl-core";

export const streamYoutubeVideo = async (req: Request, res: Response) => {
  const videoId = req.params.id;

  if (!videoId) return res.status(400).send({ message: "No id provided" });
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  res.setHeader("Content-Type", "audio/mpeg");

  ytdl(videoUrl, { quality: "highestaudio" }).pipe(res);
};
