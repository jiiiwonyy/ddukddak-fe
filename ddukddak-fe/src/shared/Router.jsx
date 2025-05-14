import React from "react";
import Home from "../pages/Home";
import DailyDiary from "../pages/DailyDiary";
import Login from "../pages/Login";
import ThemeDiary from "../pages/ThemeDiary";
import MyPage from "../pages/MyPage";

import {
  BrowserRouter as BroswerRouter,
  Routes,
  Route,
} from "react-router-dom";
import MyDiary from "../pages/MyDiary";
import DiaryListItem from "../components/DiaryListItem";
import DiaryModify from "../pages/DiaryModify";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="daily" element={<DailyDiary />} />
      <Route path="Login" element={<Login />} />
      <Route path="theme" element={<ThemeDiary />} />
      <Route path="diary" element={<MyDiary />} />
      <Route path="mypage" element={<MyPage />} />
      <Route path="modifydiary" element={<DiaryModify />} />
    </Routes>
  );
};

export default Router;
