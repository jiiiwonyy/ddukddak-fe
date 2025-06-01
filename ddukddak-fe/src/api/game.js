import axios from "../api/axiosInstance";

export const postGameResult = (data) => {
  return axios.post("/language-calc-stats/", data);
};

export const getStats = (year, month) => {
  return axios.get(`/monthly-stats`, {
    params: { year, month },
  });
};
