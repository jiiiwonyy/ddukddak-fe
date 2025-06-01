import axios from "axios";

const instance = axios.create({
  baseURL: "https://nabiya.site/api", // ✅ 본인의 API 서버 주소로 변경
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // (선택) 요청 제한 시간 설정
});

// 일상일기용 인스턴스
export const dailyInstance = axios.create({
  baseURL: "https://nabiya.site", // 일상일기 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // credentials 제거
  timeout: 10000,
});

// ✅ 요청 전에 토큰 자동 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 에러 핸들링
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 401 에러 처리 (토큰 만료 등)
      if (error.response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// dailyInstance용 에러 핸들링
dailyInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Daily Diary API Error:", error);
    return Promise.reject(error);
  }
);

export default instance;
