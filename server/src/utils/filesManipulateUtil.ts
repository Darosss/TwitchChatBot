import fs from "fs";
import getAudioDurationInSeconds from "get-audio-duration";
import path from "path";
export const getListOfDirectoryNames = (
  pathToFolders: string,
  callback: (folders: string[]) => void,
  errorCB: (errorMsg: string) => void
) => {
  const folders: string[] = [];
  fs.readdir(pathToFolders, function (err, files) {
    if (err) {
      errorCB("Something went wrong when lookin for folders");
    } else {
      files.forEach(function (file) {
        const filePath = path.join(pathToFolders, file);
        if (fs.statSync(filePath).isDirectory()) {
          folders.push(file);
        }
      });
      callback(folders);
    }
  });
};
/**
 *
 * @param pathToFolder - absolute folder path
 * @param extension - extension name fe. .mp3
 * @param callback - (files) => void
 * @param errorCB (error) => void
 */
export const getListOfFilesWithExtensionInFolder = (
  pathToFolder: string,
  extensions: string[],
  callback: (files: string[]) => void,
  errorCB: (errorMsg: string) => void
) => {
  fs.readdir(pathToFolder, function (err, files) {
    if (err) {
      errorCB("Folder probably does not exist");
    } else {
      const matchedFiles = files.filter((file) => {
        for (const ext of extensions) {
          if (path.extname(file).toLowerCase() === ext) return true;
        }
      });

      callback(matchedFiles);
    }
  });
};

export const createDirectory = (
  pathToDir: string,
  callback: (message: string) => void,
  errorCB: (errorMsg: string) => void
) => {
  fs.mkdir(pathToDir, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      errorCB("Failed to create folder");
    } else {
      callback("Folder created successfully");
    }
  });
};

export const deleteDirectory = (
  pathToDir: string,
  callback: (message: string) => void,
  errorCB: (errorMsg: string) => void
) => {
  fs.rmdir(pathToDir, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      errorCB("Failed to delete folder");
    } else {
      callback("Folder deleted successfully");
    }
  });
};

export const getMp3AudioDuration = async (path: string) => {
  const mp3DurationSec = await getAudioDurationInSeconds(path);
  return mp3DurationSec;
};

export const ensureDirectoryExists = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};
