import { NextFunction, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import {
  AppError,
  createDirectory,
  deleteDirectory,
  getListOfDirectoryNames,
  getListOfFilesWithExtensionInFolder,
  logger
} from "@utils";
import { alertSoundsPath, musicPath, alertSoundPrefix } from "@configs";
import path from "path";

const maxFilesAtOnce = 30;

if (!fs.existsSync(musicPath)) {
  fs.mkdirSync(musicPath, { recursive: true });
}
if (!fs.existsSync(alertSoundsPath)) {
  fs.mkdirSync(alertSoundsPath, { recursive: true });
}

const storageMp3 = multer.diskStorage({
  destination: function (req, file, cb) {
    const { folder } = req.params;
    cb(null, path.join(musicPath, folder));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const filterMp3: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype === "audio/mpeg") cb(null, true);
  else {
    cb(new AppError(400, "File isn't a mp3 extension"));
  }
};

const uploadMp3Multer = multer({
  storage: storageMp3,
  fileFilter: filterMp3
}).array("uploaded_file", maxFilesAtOnce);

export const uploadMp3File = (req: Request, res: Response, next: NextFunction) => {
  try {
    uploadMp3Multer(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).send({
            message: `Maximum of ${maxFilesAtOnce} files at once`,
            status: 400
          });
        }
      } else if (err) {
        return next(err);
      }

      return res.status(200).send({ message: "Mp3 files updated successfully" });
    });
  } catch (err) {
    logger.error(`Error when trying to upload mp3 files ${err}`);
    next(err);
  }
};

export const getFoldersList = (req: Request, res: Response, next: NextFunction) => {
  getListOfDirectoryNames(
    musicPath,
    (folders) => {
      return res.status(200).send({ data: folders });
    },
    (errorMsg) => {
      return next(new AppError(400, errorMsg));
    }
  );
};

export const getFolderMp3Files = (req: Request, res: Response, next: NextFunction) => {
  const { folder } = req.params;
  getListOfFilesWithExtensionInFolder(
    path.join(musicPath, folder),
    [".mp3"],
    (folders) => {
      return res.status(200).send({ data: folders });
    },
    (errorMsg) => {
      return next(new AppError(400, errorMsg));
    }
  );
};

export const deleteMp3File = (req: Request, res: Response, next: NextFunction) => {
  const { folder, fileName } = req.params;

  const filePath = path.join(musicPath, folder, fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      logger.error(`Error occured while trying to delete file ${err}`);
      return next(new AppError(400, err.message));
    } else {
      logger.info(`Deleted file ${fileName}`);
      res.status(200).send("File deleted");
    }
  });
};

export const createAudioFolder = (req: Request, res: Response, next: NextFunction) => {
  const { folder } = req.params;

  const folderPath = path.join(musicPath, folder);
  createDirectory(
    folderPath,
    (message) => {
      return res.status(200).send({ message: message });
    },
    (errorMsg) => {
      return next(new AppError(400, errorMsg));
    }
  );
};

export const deleteAudioFolder = (req: Request, res: Response, next: NextFunction) => {
  const { folder } = req.params;

  const folderPath = path.join(musicPath, folder);
  deleteDirectory(
    folderPath,
    (message) => {
      return res.status(200).send({ message: message });
    },
    (errorMsg) => {
      return next(new AppError(400, errorMsg));
    }
  );
};

const storageAlertSound = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, alertSoundsPath);
  },
  filename: function (req, file, cb) {
    const { title } = req.body;
    const fileName = title.startsWith(alertSoundPrefix) ? title + ".mp3" : `${alertSoundPrefix}${title}.mp3`;
    cb(null, fileName);
  }
});

const uploadAlertSoundMulter = multer({
  storage: storageAlertSound,
  fileFilter: filterMp3
}).single("alertSound");

export const uploadAlertSound = (req: Request, res: Response, next: NextFunction) => {
  try {
    uploadAlertSoundMulter(req, res, function (err) {
      if (err) {
        return next(err);
      }

      return res.status(200).send({ message: "Alert sound uploaded successfully" });
    });
  } catch (err) {
    logger.error(`Error when trying to upload alert sound ${err}`);
    next(err);
  }
};

export const getAlertSoundsList = (req: Request, res: Response, next: NextFunction) => {
  getListOfFilesWithExtensionInFolder(
    alertSoundsPath,
    [".mp3"],
    (sounds) => {
      return res.status(200).send({ data: sounds });
    },
    (errorMsg) => {
      return next(new AppError(400, errorMsg));
    }
  );
};

export const deleteAlertSound = (req: Request, res: Response, next: NextFunction) => {
  const { fileName } = req.params;

  const filePath = path.join(alertSoundsPath, fileName) + ".mp3";

  fs.unlink(filePath, (err) => {
    if (err) {
      logger.error(`Error occured while trying to delete alert sound  ${err}`);
      return next(new AppError(400, err.message));
    } else {
      logger.info(`Deleted alert sound ${fileName}`);
      res.status(200).send("File deleted");
    }
  });
};
