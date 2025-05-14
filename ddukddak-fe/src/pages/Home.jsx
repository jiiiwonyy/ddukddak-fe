import React from "react";
import styled from "styled-components";
import BottomNav from "../components/BottomNav";
import PageWrapper from "../components/PageWrapper"; // PageWrapper import
import HomeListItem from "../components/HomeListItem";
import { BiPencil, BiJoystick } from "react-icons/bi";

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
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const Home = () => {
  const today = new Date();
  const month = today.getMonth() + 1; // 0-based이므로 +1 필요
  const date = today.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const day = days[today.getDay()];

  const formatted = `${month}/${date}(${day})`;

  return (
    <PageWrapper>
      <FixedBackground />
      <ContentWrapper>
        <DateText className="title3">{formatted}</DateText>
        <ButtonGroup>
          <HomeListItem
            textTop="주제일기"
            textBottom="작성하기"
            backgroundColor="#E8E3FF"
            icon={<BiPencil />}
            to="/theme"
          />
          <HomeListItem
            textTop="일상일기"
            textBottom="작성하기"
            backgroundColor="#DCE8FF"
            icon={<BiPencil />}
            to="/daily"
          />
          <HomeListItem
            textTop="계산/언어"
            textBottom="게임하기"
            backgroundColor="#F1FBFF"
            icon={<BiJoystick />}
            to="/"
          />
        </ButtonGroup>
      </ContentWrapper>
      <BottomNav />
    </PageWrapper>
  );
};

export default Home;
