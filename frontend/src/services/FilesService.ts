import useAxiosCustom, { ResponseData } from "./ApiService";

export const getFoldersList = () => {
  return useAxiosCustom<ResponseData<string[]>>({
    url: `/files/folder-list`,
  });
};

export const getFolderMp3Files = (folderName: string) => {
  return useAxiosCustom<ResponseData<string[]>>({
    url: `/files/audio/${folderName}`,
    manual: true,
  });
};

export const deleteMp3File = (folderName: string, fileName: string) => {
  return useAxiosCustom<ResponseData<string>>({
    url: `/files/delete/audio/${folderName}/${fileName}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

export const createAudioFolder = (folderName: string) => {
  return useAxiosCustom<ResponseData<string>>({
    url: `/files/create/audio/${folderName}`,
    method: "POST",
    manual: true,
    urlParams: false,
  });
};

export const deleteAudioFolder = (folderName: string) => {
  return useAxiosCustom<ResponseData<string>>({
    url: `/files/delete/folder/audio/${folderName}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

export const getAlertSoundsMp3Names = () => {
  return useAxiosCustom<ResponseData<string[]>>({
    url: `/files/audio/alertSounds`,
  });
};

export const deleteAlertSound = (fileName: string) => {
  return useAxiosCustom<ResponseData<string>>({
    url: `/files/delete/alertSounds/${fileName}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
