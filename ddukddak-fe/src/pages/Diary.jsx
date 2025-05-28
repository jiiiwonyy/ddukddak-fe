import React from "react";
import PageWrapper from "../components/PageWrapper";
import Header from "../components/Header";
import { BiChevronLeft } from "react-icons/bi";
import styled from "styled-components";

const Diary = () => {
  return (
    <PageWrapper>
      <Header
        title="일상일기"
        menuIcon={BiChevronLeft}
        navigateTo={"/calendar"} // 아이콘을 prop으로 전달
      />
      <DiaryWrapper>
        <DiaryTitleInput className="title3">일기 제목</DiaryTitleInput>
        <DiaryTitleContent className="body3">일기 내용</DiaryTitleContent>
        <DiaryDate>2024년 10월 5일</DiaryDate>
      </DiaryWrapper>
    </PageWrapper>
  );
};

export default Diary;

const DiaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  align-items: center;
  margin: 20px;
  overflow: hidden;
  gap: 8px;
`;

const DiaryTitleInput = styled.div`
  width: 100%;
`;

const DiaryTitleContent = styled.div`
  width: 100%;
`;

const DiaryDate = styled.div`
  width: 100%;
`;
