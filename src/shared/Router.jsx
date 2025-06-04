import React from "react";
import Home from "../pages/Home";
import DailyDiary from "../pages/DailyDiary";
import Login from "../pages/Login";
import ThemeDiary from "../pages/ThemeDiary";
import MyPage from "../pages/MyPage";
import { Routes, Route, Navigate } from "react-router-dom";
import Calendar from "../pages/Calendar";
import DiaryModify from "../pages/DiaryModify";
import UserInfo from "../pages/UserInfo";
import Diary from "../pages/Diary";
import RetrospectDetail from "../pages/RetrospectDetail";
import SettingPage from "../pages/SettingPage";
import ProtectedRoute from "../api/ProtectedRoute";
import Game from "../pages/Game/Game";
import RetrospectDiary from "../pages/RetrospectDiary";

const Router = () => {
  return (
    <Routes>
      {/* 공개 라우트 */}
      <Route path="/" element={<Login />} />
      <Route path="login" element={<Login />} />

      {/* 보호된 라우트 */}
      <Route element={<ProtectedRoute />}>
        <Route path="home" element={<Home />} />
        <Route path="daily" element={<DailyDiary />} />
        <Route path="theme" element={<ThemeDiary />} />
        <Route path="game" element={<Game />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="modifydiary" element={<DiaryModify />} />
        <Route path="userinfo" element={<UserInfo />} />
        <Route path="diary" element={<Diary />} />
        <Route path="diary/:id" element={<Diary />} />
        <Route path="retrospect" element={<RetrospectDiary />} />
        <Route path="retrospectdetail" element={<RetrospectDetail />} />
        <Route path="retrospectdetail/:id" element={<RetrospectDetail />} />
        <Route path="setting" element={<SettingPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
