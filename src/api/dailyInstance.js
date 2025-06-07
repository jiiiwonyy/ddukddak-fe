import axios from "axios";

const dailyInstance = axios.create({
  baseURL: "https://nabiya.site",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
  timeout: 15000,
});

dailyInstance.interceptors.request.use((config) => {
  const aijwt = localStorage.getItem("ai_jwt_token");
  if (aijwt) config.headers.Authorization = `Bearer ${aijwt}`;
  return config;
});

// dailyInstance용 에러 핸들링
dailyInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Daily Diary API Error:", error);
    if (error.response) {
      // 401 에러 처리 (토큰 만료 등)
      if (error.response.status === 401) {
        localStorage.removeItem("ai_jwt_token");
        window.location.href = "/login";
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default dailyInstance;
