import React from "react";
import Home from "../pages/Home";
import DailyDiary from "../pages/DailyDiary";
import Login from "../pages/Login";
import ThemeDiary from "../pages/ThemeDiary";
import {
  BrowserRouter as BroswerRouter,
  Routes,
  Route,
} from "react-router-dom";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="daily" element={<DailyDiary />} />
      <Route path="Login" element={<Login />} />
      <Route path="theme" element={<ThemeDiary />} />
    </Routes>
  );
};

export default Router;
