import { useState } from "react";
import axios, { AxiosError } from "axios";
import { viteBackendUrl } from "src/configs/envVariables";

export const useFileUpload = (url: string) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>();
  const [success, setSuccess] = useState<any>();

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
