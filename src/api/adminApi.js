import axiosClient from "./axiosClient";

const adminApi = {
  login: (data) => axiosClient.post(`/admin/login`, data),
};

export default adminApi;
