import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const HeaderWrapper = styled.header`
  width: 100%;
  height: 3.75rem;
  padding: 1.0625rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem; /* 페이지 하단 여백 */
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px; /* 화면 크기에 따라 최대로 늘어나는 너비 제한 */
  padding: 0 20px; /* 좌우 여백 */
`;

const Title = styled.h1`
  flex: 1; /* 타이틀을 가운데로 배치 */
  text-align: center;
`;

const MenuButton = styled.button`
  color: #212121;
  background: transparent;
  border: none;
  align-items: center;
  position: absolute; /* 아이콘을 왼쪽에 고정 */
  left: 20px; /* 왼쪽 여백 */
  cursor: pointer;
`;

const Header = ({ title = "", menuIcon: MenuIcon, navigateTo }) => {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };
  return (
    <HeaderWrapper>
      <HeaderContent>
        <MenuButton onClick={handleMenuClick}>
          {MenuIcon && <MenuIcon size={32} />}
        </MenuButton>
        <Title className="title2">{title}</Title>
        <div style={{ width: 0 }} /> {/* 아이콘 없는 쪽 공간 맞추기 용도 */}
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;
