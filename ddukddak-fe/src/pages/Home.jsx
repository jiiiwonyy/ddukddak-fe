import React from "react";
import styled from "styled-components";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom"; // useNavigate import
import PageWrapper from "../components/PageWrapper"; // PageWrapper import

const FixedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* 100vh로 화면 크기에 맞춰 배경 조정 */
  background: url("/assets/images/bg.svg") no-repeat center center;
  background-size: cover; /* 배경 이미지 비율에 맞춰 크기 조정 */
  background-attachment: fixed; /* 스크롤 시 배경 이미지도 같이 이동 */
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: absolute;
  z-index: 1;
  background: white;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 1.5rem 1rem;
  height: calc(100vh - 60vh); /* 나머지 영역 */
  overflow-y: auto; /* 스크롤 활성화 */
  bottom: 0;
  width: 100%;
  overflow-x: hidden; /* 가로 스크롤 막음 */
`;

const DateText = styled.div`
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const CardButton = styled.button`
  flex: 1 1 calc(33.333% - 0.666rem);
  background-color: #f5f5ff;
  border: none;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 100px;
`;

const Home = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleClick = (path) => {
    navigate(path); // path로 이동
  };

  return (
    <PageWrapper>
      <FixedBackground />
      <ContentWrapper>
        <DateText>4/8(화)</DateText>
        <ButtonGroup>
          <CardButton onClick={() => handleClick("/theme-diary")}>
            주제일기 작성하기
          </CardButton>
          <CardButton onClick={() => handleClick("/daily-diary")}>
            일상일기 작성하기
          </CardButton>
          <CardButton>계산/언어 게임하기</CardButton>
        </ButtonGroup>
      </ContentWrapper>
      <BottomNav />
    </PageWrapper>
  );
};

export default Home;
