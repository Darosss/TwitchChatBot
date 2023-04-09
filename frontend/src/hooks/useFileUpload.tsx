import { useState } from "react";
import axios, { AxiosError } from "axios";

const useFileUpload = (url: string) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>();
  const [success, setSuccess] = useState<any>();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formData = new FormData();
    const files = event.target.files;
    if (!files) {
      setError("No files found");
      return;
    }

    [...files].forEach((file) => {
      formData.append("uploaded_file", file, file.name);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/${url}`,
        formData,
        {
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
        }
      );
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

export default useFileUpload;
