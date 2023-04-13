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

export const getListOfMp3InFolder = (
  pathToFolder: string,
  callback: (files: string[]) => void,
  errorCB: (errorMsg: string) => void
) => {
  fs.readdir(pathToFolder, function (err, files) {
    if (err) {
      errorCB("Folder probably does not exist");
    } else {
      const mp3Files = files.filter((file) => {
        return path.extname(file).toLowerCase() === ".mp3";
      });

      callback(mp3Files);
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
