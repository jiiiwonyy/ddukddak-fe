// src/api/auth.js
import axios from "./axiosInstance";

// 카카오 로그인
export const loginWithKakao = (code) => {
  return axios.post("/oauth/login/", new URLSearchParams({ code }), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

// 토큰 저장
export const setToken = (token) => {
  localStorage.setItem("access_token", token);
};

// 토큰 조회
export const getToken = () => {
  return localStorage.getItem("access_token");
};

// 토큰 삭제
export const removeToken = () => {
  localStorage.removeItem("access_token");
};

// 로그인 상태 확인
export const isLoggedIn = () => {
  return getToken() !== null;
};
