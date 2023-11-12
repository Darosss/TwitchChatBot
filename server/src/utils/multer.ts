import { AppError } from "@utils";
import multer from "multer";

export const filterMp3: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype === "audio/mpeg") cb(null, true);
  else {
    cb(new AppError(400, "File isn't a mp3 extension"));
  }
};

export const filterImage: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype.includes("image")) cb(null, true);
  else {
    cb(new AppError(400, "File isn't a image[.png, .jpeg, .jpg] extension"));
  }
};
