import React from "react";
import Header from "../components/Header";
import { BiChevronLeft } from "react-icons/bi";
import BottmNav from "../components/BottomNav"; // BottomNav 컴포넌트 import

const Home = () => {
  return (
    <div className="home">
      <Header
        title="Ddukddak"
        menuIcon={BiChevronLeft} // 아이콘을 prop으로 전달
      />
      <h1>Welcome to Ddukddak!</h1>
      <p>Your one-stop solution for delicious Korean food.</p>
      <button className="order-button">Order Now</button>
      <BottmNav />
    </div>
  );
};

export default Home;
