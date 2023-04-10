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
