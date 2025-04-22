import React from "react";
import Home from "./pages/Home";
import UserInfo from "./pages/UserInfo";
import "./App.css"; // 여기서 기본 CSS를 적용
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user-info" element={<UserInfo />} />
    </Routes>
  );
}
export default App;
