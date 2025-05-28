import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const DiaryListItem = ({ diarytype, date }) => {
  const navigate = useNavigate(); // 추가

  const handleClick = () => {
    if (diarytype === "회상") {
      navigate("/retrospectdetail");
    } else {
      navigate("/diary");
    }
  };
  return (
    <ItemWrapper diaryType={diarytype} onClick={handleClick}>
      <DateText className="body2">{date}</DateText>
      <DiaryType className="body2">{diarytype}</DiaryType>
    </ItemWrapper>
  );
};

export default DiaryListItem;

const ItemWrapper = styled.div`
  padding: 10px;
  margin: 4px 0;
  border-radius: 8px;
  background-color: ${({ diaryType }) =>
    diaryType === "주제일기"
      ? "#DCD6FF"
      : diaryType === "일상일기"
      ? "#DCE8FF"
      : "#FFE7E7"};
  cursor: pointer;
`;

const DateText = styled.div`
  color: #121212;
`;

const DiaryType = styled.div`
  color: #121212;
  text-align: right;
`;
