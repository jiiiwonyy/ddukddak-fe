import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const getDiaryTypeLabel = (type) => {
  if (type === "topic") return "주제일기";
  if (type === "daily") return "일상일기";
  if (type === "reminiscence") return "회상";
  return type;
};

const DiaryListItem = ({ id, diarytype, date, title }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (diarytype === "reminiscence") {
      navigate("/retrospectdetail");
    } else {
      navigate(`/diary/${id}`);
    }
  };
  return (
    <ItemWrapper $diaryType={diarytype} onClick={handleClick}>
      <TitleText className="body2">{title}</TitleText>
      <DiaryType className="body2">{getDiaryTypeLabel(diarytype)}</DiaryType>
      <DateText className="body2">{date}</DateText>
    </ItemWrapper>
  );
};

export default DiaryListItem;

const ItemWrapper = styled.div`
  padding: 10px;
  margin: 4px 0;
  border-radius: 8px;
  background-color: ${({ $diaryType }) =>
    $diaryType === "topic"
      ? "#DCD6FF"
      : $diaryType === "daily"
      ? "#DCE8FF"
      : "#FFE7E7"};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TitleText = styled.div`
  color: #121212;
  font-weight: bold;
`;

const DiaryType = styled.div`
  color: #121212;
  text-align: left;
  font-size: 0.95em;
`;

const DateText = styled.div`
  color: #666;
  font-size: 0.95em;
`;
