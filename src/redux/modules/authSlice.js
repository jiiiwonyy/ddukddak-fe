import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: !!localStorage.getItem("access_token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id"); // AI 서버 인증용
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
