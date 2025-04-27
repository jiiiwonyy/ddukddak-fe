import React from "react";
import Home from "./pages/Home";
import UserInfo from "./pages/UserInfo";
import ThemeDiary from "./pages/ThemeDiary"; // 주제일기 작성 페이지
import DailyDiary from "./pages/DailyDiary"; // 일상일기 작성 페이지
import "./App.css"; // 여기서 기본 CSS를 적용
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/theme-diary" element={<ThemeDiary />} />
        <Route path="/daily-diary" element={<DailyDiary />} />
      </Routes>
    </Router>
  );
}

export default App;
