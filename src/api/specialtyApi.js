import axiosClient from "./axiosClient"


const specialtyApi = {
    getAll: () => axiosClient.get(`/list-specialty`),
    getById: (id) => axiosClient.get(`/specialty/${id}`),
    create: (specialty) => axiosClient.post(`/specialty/create`, specialty),
    update: (id, specialty) => axiosClient.put(`/specialty/update/${id}`, specialty),
    deleteById: (id) => axiosClient.delete(`/specialty/delete/${id}`)
}

export default specialtyApi