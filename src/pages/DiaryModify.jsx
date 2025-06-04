import React, { useEffect } from "react";
import Header from "../components/Header";
import PageWrapper from "../components/PageWrapper";
import styled from "styled-components";
import MainButton from "../components/MainButton";
import { postDiary } from "../api/diary"; // getDiaryDetail 추가
import { useParams, useNavigate, useLocation } from "react-router-dom";

const DiaryModify = () => {
  const location = useLocation();
  const diary = location.state?.diary;

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [date, setDate] = React.useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  // 기존 일기 데이터 불러오기
  useEffect(() => {
    if (diary) {
      setTitle(diary.title || "");
      setContent(diary.body || "");
      setDate(diary.diary_date || "");
    }
  }, [diary]);

  const handleSubmit = async () => {
    try {
      await postDiary(title, content);
      alert("일기 수정 성공");
      navigate(`/diary/${id}`);
    } catch (e) {
      console.error(e);
      alert("일기 등록 실패");
    }
  };

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
        <DiaryDate className="body1">
          {date
            ? `${date.slice(0, 4)}년 ${Number(date.slice(5, 7))}월 ${Number(
                date.slice(8, 10)
              )}일`
            : ""}
        </DiaryDate>
        <ModifyButtonWrapper>
          <MainButton text="일상일기 수정 완료" onClick={handleSubmit} />
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
