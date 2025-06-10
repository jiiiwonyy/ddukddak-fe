import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PageWrapper from "../components/PageWrapper";
import styled from "styled-components";
import MainButton from "../components/MainButton";
import {
  postDiary,
  sendDailyDiaryToAI,
  sendThemeDiaryToAI,
} from "../api/diary"; // 등록용 함수만 사용
import { useNavigate, useLocation } from "react-router-dom";
import { getLocalDateString } from "../api/time";

const DiaryModify = () => {
  const location = useLocation();
  const diary = location.state?.diary;
  const category = location.state?.category;
  const today = getLocalDateString();
  const [diaryDate] = useState(today);

  const [title, setTitle] = useState(diary?.title || "");
  const [body, setBody] = useState(diary?.body || "");

  const navigate = useNavigate();

  useEffect(() => {
    if (diary) {
      setTitle(diary.title || "");
      setBody(diary.body || "");
    }
  }, [diary]);

  // 4. 등록 버튼
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      await postDiary(diaryDate, category, title, body);
      if (category === "daily") {
        // 일상일기일 때 AI 서버 전송
        await sendDailyDiaryToAI(title, body);
        navigate("/retrospect");
      } else {
        // 주제일기일 때 AI 서버 전송
        await sendThemeDiaryToAI(title, body, "theme");
        navigate("/home");
      }
      alert("일기 등록 성공");
    } catch (e) {
      console.error(e);
      alert("일기 등록 실패");
    }
  };

  return (
    <PageWrapper>
      <Header
        title={category === "daily" ? "일상일기 수정하기" : "주제일기 수정하기"}
      />
      <PageBody>
        <DiaryTitle
          className="body2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />
        <DiaryBox
          className="body2"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="내용을 입력하세요"
        />
        <DateWrapper>
          <DiaryDate className="body1">{today}</DiaryDate>
          <div className="body1">제목과 내용은 클릭해서 수정할 수 있어요!</div>
        </DateWrapper>
        <MainButton text="일기 등록 완료" onClick={handleSubmit} />
      </PageBody>
    </PageWrapper>
  );
};

// 스타일 컴포넌트들은 기존 그대로 사용!
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
  min-height: 350px;
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

const DateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const DiaryDate = styled.div`
  display: flex;
`;

export default DiaryModify;
