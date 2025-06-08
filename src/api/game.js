import axios from "../api/axiosInstance";

export const postGameResult = (data) => {
  return axios.post("/language-calc-stats/", data);
};

export const getStats = (year, month) => {
  return axios.get(`/stats/monthly/`, {
    params: { year, month },
  });
};

export const getGameDate = (date) => {
  return axios.get(`/language-calc-stats/?game_date=${date}`);
};
