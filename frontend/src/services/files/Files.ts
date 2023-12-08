import useAxiosCustom, { ResponseData } from "../api";

export const useGetFoldersList = () => {
  return useAxiosCustom<ResponseData<string[]>>({
    url: `/files/folder-list`,
  });
};

export const useGetFolderMp3Files = (folderName: string) => {
  return useAxiosCustom<ResponseData<string[]>>({
    url: `/files/audio/${folderName}`,
    manual: true,
  });
};

export const useDeleteMp3File = (folderName: string, fileName: string) => {
  return useAxiosCustom<ResponseData<string>>({
    url: `/files/delete/audio/${folderName}/${fileName}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

export const useCreateAudioFolder = (folderName: string) => {
  return useAxiosCustom<ResponseData<string>>({
    url: `/files/create/audio/${folderName}`,
    method: "POST",
    manual: true,
    urlParams: false,
  });
};

export const useDeleteAudioFolder = (folderName: string) => {
  return useAxiosCustom<ResponseData<string>>({
    url: `/files/delete/folder/audio/${folderName}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

export const useGetAlertSoundsMp3Names = () => {
  return useAxiosCustom<ResponseData<string[]>>({
    url: `/files/audio/alertSounds`,
  });
};

export const useDeleteAlertSound = (fileName: string) => {
  return useAxiosCustom<ResponseData<string>>({
    url: `/files/delete/alertSounds/${fileName}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
