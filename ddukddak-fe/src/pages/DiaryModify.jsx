import React from "react";
import Header from "../components/Header";
import PageWrapper from "../components/PageWrapper";
import styled from "styled-components";
import MainButton from "../components/MainButton";

const DiaryModify = () => {
  const [title, setTitle] = React.useState("일기 제목이 들어갑니다.");
  const [content, setContent] = React.useState("일기 내용이 들어갑니다.");
  return (
    <PageWrapper>
      <Header title="일상일기 수정" />
      <PageBody>
        <DiaryTitle
          className="body2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <DiaryBox
          className="body2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <DiaryDate className="body1">2023년 10월 1일</DiaryDate>
        <ModifyButtonWrapper>
          <MainButton
            text="일상일기 수정 완료"
            onClick={() => console.log("입력 완료")}
          />
        </ModifyButtonWrapper>
      </PageBody>
    </PageWrapper>
  );
};

const DiaryTitle = styled.input`
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  background-color: #f3f7ff;
  border-radius: 1rem;
  min-height: 50px;
  width: 100%;
  border: none;
  outline: none;
  margin-bottom: 0.5em;
`;

const DiaryBox = styled.textarea`
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  background-color: #f3f7ff;
  border-radius: 1rem;
  min-height: 300px;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
`;

const PageBody = styled.div`
  display: flex;
  background-color: #fff;
  flex-direction: column;
  padding: 20px;
  position: relative;
`;

const DiaryDate = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const ModifyButtonWrapper = styled.div`
  position: fixed;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 0 1.5rem;
`;

export default DiaryModify;
