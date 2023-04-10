import fs from "fs";
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
