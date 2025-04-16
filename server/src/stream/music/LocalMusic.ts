import { musicFolderName, musicPath } from "@configs";
import { getListOfDirectoryNames, getListOfFilesWithExtensionInFolder, getMp3AudioDuration, musicLogger } from "@utils";
import path from "path";
import { SongProperties } from "@socket";

class LocalMusic {
  constructor() {}

  private async getPublicMp3FoldersList() {
    return await new Promise<string[]>((resolve, reject) => {
      getListOfDirectoryNames(
        musicPath,
        (folders) => {
          resolve(folders);
        },
        (err) => {
          musicLogger.error(`Error occured while trying to get music folders names ${err}`);
          reject("Error occured while trying to get music folders names");
        }
      );
    });
  }

  public async getMp3FilesFromFolder(folder: string) {
    return await new Promise<string[]>((resolve, reject) => {
      getListOfFilesWithExtensionInFolder(
        path.join(musicPath, folder),
        ["mp3"],
        (files) => {
          resolve(files);
        },
        (err) => {
          musicLogger.error(`Error occured while trying to search song by name ${err}`);
          reject("Error occured while trying to search song by name");
        }
      );
    });
  }

  public async getSongsPropertiesFromFolder(folderName: string): Promise<SongProperties[]> {
    const songProperties: SongProperties[] = [];
    const currentFolderMp3 = await this.getMp3FilesFromFolder(folderName);

    for await (const song of currentFolderMp3) {
      const mp3Path = path.join(musicPath, folderName, song);
      const nameWithoutExt = song.split(".")[0];
      songProperties.push({
        name: nameWithoutExt,
        id: folderName + "-" + nameWithoutExt,
        duration: await getMp3AudioDuration(mp3Path),
        downloadedData: {
          publicPath: path.join(musicFolderName, folderName, song),
          folderName,
          fileName: song
        },
        type: "local"
      });
    }

    return songProperties;
  }

  public async getSongPropertiesByName(songName: string): Promise<SongProperties | undefined> {
    const folders = await this.getPublicMp3FoldersList();
    for await (const folder of folders) {
      const currentFolderMp3 = await this.getMp3FilesFromFolder(folder);
      const foundMp3 = currentFolderMp3.find((name) => name.toLowerCase().includes(songName.toLowerCase()));
      if (foundMp3) {
        const mp3Path = path.join(musicPath, folder, foundMp3);
        const nameWithoutExt = foundMp3.replace(/\.mp3$/, "");

        return {
          name: nameWithoutExt,
          id: folder + "-" + nameWithoutExt,
          duration: await getMp3AudioDuration(mp3Path),
          type: "local",
          downloadedData: {
            publicPath: path.join(musicFolderName, folder, foundMp3),
            folderName: folder,
            fileName: foundMp3
          }
        };
      }
    }
  }
}

const localMusic = new LocalMusic();
export { LocalMusic };
export default localMusic;
