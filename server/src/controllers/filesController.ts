import Express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import { AppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { musicPath } from "@configs/globalPaths";
const maxFilesAtOnce = 30;

if (!fs.existsSync(musicPath)) {
  fs.mkdirSync(musicPath, { recursive: true });
}

const storageMp3 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, musicPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const filterMp3: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype === "audio/mpeg") cb(null, true);
  else {
    cb(new AppError(400, "File isn't a mp3 extension"));
  }
};

export const uploadMp3Multer = multer({
  storage: storageMp3,
  fileFilter: filterMp3,
}).array("uploaded_file", maxFilesAtOnce);

export const uploadMp3File = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    uploadMp3Multer(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).send({
            message: `Maximum of ${maxFilesAtOnce} files at once`,
            status: 400,
          });
        }
      } else if (err) {
        return next(err);
      }

      return res
        .status(200)
        .send({ message: "Mp3 files updated successfully" });
    });
  } catch (err) {
    logger.error(`Error when trying to upload mp3 files ${err}`);
    next(err);
  }
};

export const getFoldersList = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getFolderMp3Files = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteMp3File = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
