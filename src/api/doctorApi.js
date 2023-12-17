import axiosClient from "./axiosClient";

const doctorApi = {
  getAll: (page) => axiosClient.get(`/list-doctor`, { params: { page } }),
  getById: (id) => axiosClient.get(`/doctor/${id}`),
  create: (doctor) => axiosClient.post(`/doctor/create`, doctor),
  update: (id, doctor) => axiosClient.put(`/doctor/update/${id}`, doctor),
  deleteById: (id) => axiosClient.delete(`/doctor/delete/${id}`)
};

export default doctorApi;
