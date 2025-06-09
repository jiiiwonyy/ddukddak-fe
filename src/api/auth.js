import axios from "./axiosInstance";

// 카카오 로그인
export const loginWithKakao = async (code) => {
  // 1. 카카오 로그인 → 토큰 발급
  const loginRes = await axios.post(
    "/oauth/login/",
    new URLSearchParams({ code }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  const token = loginRes.data.token;
  setToken(token);

  // 2. 프로필 조회(토큰 인증 필요, 자동으로 헤더 붙으면 됨)
  const profileRes = await axios.get("/users/profile/");
  const userId = profileRes.data.id; // API에 따라 'id' 또는 'user_id'
  setUserId(userId);

  // 3. 필요하면 profile, token 등 리턴
  return {
    token,
    userId,
    profile: profileRes.data,
  };
};

// 토큰 저장/조회/삭제
export const setToken = (token) => {
  localStorage.setItem("access_token", token);
};
export const getToken = () => localStorage.getItem("access_token");
export const removeToken = () => localStorage.removeItem("access_token");

// 유저아이디 저장/조회/삭제
export const setUserId = (userId) => localStorage.setItem("user_id", userId);
export const getUserId = () => localStorage.getItem("user_id");
export const removeUserId = () => localStorage.removeItem("user_id");

// 로그인 상태 확인 (백엔드 인증/AI 인증 목적에 맞게)
export function isLoggedIn() {
  return (
    !!localStorage.getItem("access_token") &&
    !!localStorage.getItem("ai_jwt_token")
  );
}
// export const isLoggedIn = () => getToken() !== null; // 백엔드 인증 필요시
// export const isLoggedIn = () => getUserId() !== null; // AI서버만 쓸 땐 이거!
