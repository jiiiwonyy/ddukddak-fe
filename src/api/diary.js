import axios from "../api/axiosInstance";
import dailyInstance from "../api/dailyInstance";

export const getMonthlyDiaries = (year, month) => {
  return axios.get(`/diaries/monthly`, {
    params: { year, month },
  });
};

export const getDiaryDetail = (id) => {
  return axios.get(`/diaries/${id}/`);
};

export const postDiary = (diary_date, category, title, body) => {
  return axios.post("/diaries/", {
    diary_date,
    category,
    title,
    content: body,
  });
};

export const startDailyDiary = () => {
  return dailyInstance.get(`/start`);
};

export const startThemeDiary = () => {
  return dailyInstance.get(`/theme/start`);
};
