import axiosClient from "./axiosClient";

const fileApi = {
  upload: (file) =>
    axiosClient.post(`/file/upload`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default fileApi;
