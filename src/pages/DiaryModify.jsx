import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PageWrapper from "../components/PageWrapper";
import styled from "styled-components";
import MainButton from "../components/MainButton";
import { postDiary } from "../api/diary"; // 등록용 함수만 사용
import { useNavigate, useLocation } from "react-router-dom";

const DiaryModify = () => {
  const location = useLocation();
  const diary = location.state?.diary;

  // 1. 오늘 날짜 자동 입력
  const today = new Date().toISOString().split("T")[0];
  const [diaryDate] = useState(today); // 무조건 오늘 날짜 (수정 불가)

  // 2. category 자동 (페이지에서 state로 넘김, 기본값은 daily)
  const category = location.state?.category || "daily";

  // 3. 일기 본문/제목은 diary에서 받아와서 state로 초기화
  const [title, setTitle] = useState(diary?.title || "");
  const [body, setBody] = useState(diary?.body || "");

  const navigate = useNavigate();

  // diary 객체가 바뀌면 다시 초기화 (이건 안전장치)
  useEffect(() => {
    if (diary) {
      setTitle(diary.title || "");
      setBody(diary.body || "");
      // diaryDate, category는 여기서 건드리지 않음!
    }
  }, [diary]);

  // 4. 등록 버튼
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // ← 필수!
    try {
      await postDiary(diaryDate, category, title, body);
      console.log({ diaryDate, category, title, body });

      alert("일기 등록 성공");
      navigate("/home");
    } catch (e) {
      console.error(e);
      alert("일기 등록 실패");
    }
  };

  return (
    <PageWrapper>
      <Header
        title={category === "daily" ? "일상일기 등록" : "주제일기 등록"}
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
        {/* 오늘 날짜 읽기전용으로 표기 */}
        <DiaryDate className="body1">{today}</DiaryDate>
        <ModifyButtonWrapper>
          <MainButton text="일기 등록 완료" onClick={handleSubmit} />
        </ModifyButtonWrapper>
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
