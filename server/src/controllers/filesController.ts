import Express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import { AppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { musicPath } from "@configs/globalPaths";
import path from "path";
import {
  createDirectory,
  deleteDirectory,
  getListOfDirectoryNames,
  getListOfMp3InFolder,
} from "@utils/filesManipulateUtil";
const maxFilesAtOnce = 30;

if (!fs.existsSync(musicPath)) {
  fs.mkdirSync(musicPath, { recursive: true });
}

const storageMp3 = multer.diskStorage({
  destination: function (req, file, cb) {
    const { folder } = req.params;
    cb(null, path.join(musicPath, folder));
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

export const uploadMp3File = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    uploadMp3Multer(req, res, function (err) {
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
) => {
  getListOfDirectoryNames(
    musicPath,
    (folders) => {
      return res.status(200).send({ data: folders });
    },
    (errorMsg) => {
      return res.status(400).send({ message: errorMsg });
    }
  );
};

export const getFolderMp3Files = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { folder } = req.params;
  getListOfMp3InFolder(
    path.join(musicPath, folder),
    (folders) => {
      return res.status(200).send({ data: folders });
    },
    (errorMsg) => {
      return res.status(400).send({ message: errorMsg });
    }
  );
};

export const deleteMp3File = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { folder, fileName } = req.params;

  const filePath = path.resolve(
    __dirname,
    `../public/music/${folder}/${fileName}`
  );

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting file");
    } else {
      console.log(`Deleted file ${fileName}`);
      res.status(200).send("File deleted");
    }
  });
};

export const createAudioFolder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { folder } = req.params;

  const folderPath = path.resolve(__dirname, `../public/music/${folder}`);

  createDirectory(
    folderPath,
    (message) => {
      return res.status(200).send({ message: message });
    },
    (errorMsg) => {
      return res.status(400).send({ message: errorMsg });
    }
  );
};

export const deleteAudioFolder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { folder } = req.params;

  const folderPath = path.resolve(__dirname, `../public/music/${folder}`);

  deleteDirectory(
    folderPath,
    (message) => {
      return res.status(200).send({ message: message });
    },
    (errorMsg) => {
      return res.status(400).send({ message: errorMsg });
    }
  );
};
