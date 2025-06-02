import React from "react";
import styled from "styled-components";
import { format } from "date-fns";
import DiaryDot from "./DiaryDot";

const DayCell = ({ day, isCurrentMonth, isToday, onClick, diaryTypes }) => {
  const uniqueTypes = [...new Set(diaryTypes)];

  return (
    <Day
      className="body3"
      $isCurrentMonth={isCurrentMonth}
      $isToday={isToday}
      onClick={() => onClick(day)}
    >
      {format(day, "d")}
      <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
        {uniqueTypes.map((type) => (
          <DiaryDot key={type} type={type} />
        ))}
      </div>
    </Day>
  );
};

export default DayCell;

const Day = styled.div`
  padding: 10px 0;
  text-align: center;
  background: #f3f7ff;
  color: ${({ $isCurrentMonth }) => ($isCurrentMonth ? "#121212" : "#8E8E93")};
  font-weight: ${({ $isToday }) => ($isToday ? "bold" : "normal")};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;
