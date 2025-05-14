import React from "react";
import styled from "styled-components";

const DiaryListItem = ({ diaryType, date }) => {
  return (
    <ItemWrapper diaryType={diaryType}>
      <DateText className="body2">{date}</DateText>
      <DiaryType className="body2">{diaryType}</DiaryType>
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
      : diaryType === "회상"
      ? "#FFE7E7)"
      : "#dcd6ff"};
`;

const DateText = styled.div`
  color: #121212;
`;

const DiaryType = styled.div`
  color: #121212;
  text-align: right;
`;
