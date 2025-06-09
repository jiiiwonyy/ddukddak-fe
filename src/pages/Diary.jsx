import React from "react";
import PageWrapper from "../components/PageWrapper";
import Header from "../components/Header";
import { BiChevronLeft } from "react-icons/bi";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { getDiaryDetail } from "../api/diary";
import { useEffect, useState } from "react";

const getDiaryTypeLabel = (type) => {
  if (type === "topic") return "주제일기";
  if (type === "daily") return "일상일기";
  if (type === "reminiscence") return "회상";
  return type;
};

const Diary = () => {
  const { id } = useParams();
  const [diary, setDiary] = useState(null);

  useEffect(() => {
    if (id) {
      getDiaryDetail(id)
        .then((res) => setDiary(res.data))
        .catch(() => setDiary(null));
    }
  }, [id]);

  if (!diary) {
    return (
      <PageWrapper>
        <Header
          title="일상일기"
          menuIcon={BiChevronLeft}
          navigateTo={"/calendar"}
        />
        <DiaryWrapper>
          <div>불러오는 중...</div>
        </DiaryWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header
        title={` ${getDiaryTypeLabel(diary.category)}`}
        menuIcon={BiChevronLeft}
        navigateTo={"/calendar"}
      />
      <DiaryWrapper>
        <DiaryTitleInput className="title3">{diary.title}</DiaryTitleInput>
        <DiaryTitleContent className="body3">{diary.content}</DiaryTitleContent>
        <DiaryDate>{diary.diary_date}</DiaryDate>
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

const DiaryTitleContent = styled.div`
  white-space: pre-line;
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

const DiaryDate = styled.div`
  width: 100%;
`;
