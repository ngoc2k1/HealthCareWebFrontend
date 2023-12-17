import axiosClient from "./axiosClient";

const scheduleApi = {
  getDateByDoctor: (doctorId) => axiosClient.get(`/date-by-doctor/${doctorId}`),
  getTimeByDoctor: (doctorId, date) =>
    axiosClient.get(`/time-by-doctor/${doctorId}`, { params: { date } }),
  editSchedule: (data) => axiosClient.post(`/edit-schedule`, data),
};

export default scheduleApi;
