import React from "react";
import styled from "styled-components";
import { BiPencil, BiCalendar, BiUser } from "react-icons/bi";

const BottomNavWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
  z-index: 100;
`;

const BottomNavContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 4rem; /* 네비게이션 바의 높이 */
  padding: 0 20px;
`;

const NavItem = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  color: #8e8e93;
  cursor: pointer;

  &:hover {
    color: #121212; /* Hover 시 색상 변경 */
  }

  &.active {
    color: #121212; /* 활성화된 항목 색상 */
  }

  span {
    font-size: 0.75rem;
    margin-top: 4px;
  }
`;

const BottomNav = ({ activeTab = "home", onTabChange }) => {
  return (
    <BottomNavWrapper>
      <BottomNavContent>
        <NavItem
          className={activeTab === "home" ? "active" : ""}
          onClick={() => onTabChange("home")}
        >
          <BiPencil size={24} />
          <span className="body1">홈</span>
        </NavItem>
        <NavItem
          className={activeTab === "search" ? "active" : ""}
          onClick={() => onTabChange("search")}
        >
          <BiCalendar size={24} />
          <span className="body1">나의 일기장</span>
        </NavItem>
        <NavItem
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => onTabChange("profile")}
        >
          <BiUser size={24} />
          <span className="body1">내 정보</span>
        </NavItem>
      </BottomNavContent>
    </BottomNavWrapper>
  );
};

export default BottomNav;
