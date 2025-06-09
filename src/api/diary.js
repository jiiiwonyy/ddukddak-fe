import axios from "../api/axiosInstance";
import dailyInstance from "../api/dailyInstance";
import { getLocalDateString } from "../api/time";

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

export const postRetrospectDiary = (body) => {
  return axios.post("/diaries/", body);
};

export const startDailyDiary = () => {
  return dailyInstance.get(`/start`);
};

export const startThemeDiary = () => {
  return dailyInstance.get(`/theme/start`);
};

export const startRetrospectDiary = () => {
  return dailyInstance.post(`/recall-session/start`, {
    date: getLocalDateString(),
  });
};

export const answerRetrospectDiary = (payload) => {
  return dailyInstance.post(`/recall-session/answer`, payload);
};

export const sendDailyDiaryToAI = (title, body, theme) => {
  return dailyInstance.post("/theme/save-diary", { title, body, theme });
};

export const sendThemeDiaryToAI = (title, body) => {
  return dailyInstance.post("/save-diary", { title, body });
};
