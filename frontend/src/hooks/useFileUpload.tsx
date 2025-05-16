import { useState } from "react";
import axios, { AxiosError } from "axios";
import { viteBackendUrl } from "@configs/envVariables";

type UseFileUploadReturnType = {
  uploadProgress: number;
  handleFileUpload: (
    props: {
      event?: React.ChangeEvent<HTMLInputElement>;
      fileList?: FileList | null;
      bodySingleFileName?: {
        bodyName: string;
        value: string;
      };
    },
    formInputName: string
  ) => Promise<void>;
  error: string | null;
  success: any;
};

export const useFileUpload = (url: string): UseFileUploadReturnType => {
  const [uploadProgress, setUploadProgress] =
    useState<UseFileUploadReturnType["uploadProgress"]>(0);
  const [error, setError] = useState<UseFileUploadReturnType["error"]>(null);
  const [success, setSuccess] = useState<UseFileUploadReturnType["success"]>();

  const handleFileUpload = async (
    props: {
      event?: React.ChangeEvent<HTMLInputElement>;
      fileList?: FileList | null;
      bodySingleFileName?: { bodyName: string; value: string };
    },
    formInputName: string
  ) => {
    const { event, fileList, bodySingleFileName } = props;

    const formData = new FormData();
    const files = event?.target.files || fileList;
    if (!files) {
      setError("No files found");
      return;
    }

    if (bodySingleFileName) {
      formData.append(bodySingleFileName.bodyName, bodySingleFileName.value);
    }

    [...files].forEach((file) => {
      formData.append(formInputName, file, file.name);
    });

    try {
      const response = await axios.post(`${viteBackendUrl}/${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentage);
          }
        },
      });
      setSuccess(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      } else {
        console.error(error);
      }
    }
  };

  return {
    uploadProgress,
    handleFileUpload,
    error,
    success,
  };
};
