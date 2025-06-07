import axios from "./axiosInstance";

export const saveUserProfile = (data) => {
  return axios.patch("/users/update_profile/", data);
};

// 사용자 정보 조회
export const getUserProfile = () => {
  return axios.get("/users/profile/");
};
