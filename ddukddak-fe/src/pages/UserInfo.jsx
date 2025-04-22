import { BiChevronLeft } from "react-icons/bi";
import React from "react";
import Header from "../components/Header";
import BottmNav from "../components/BottomNav"; // BottomNav 컴포넌트 import

const UserInfo = () => {
  return (
    <div className="user-info">
      <Header
        title="개인정보 입력"
        menuIcon={BiChevronLeft} // 아이콘을 prop으로 전달
      />
      <BottmNav />
    </div>
  );
};

export default UserInfo;
