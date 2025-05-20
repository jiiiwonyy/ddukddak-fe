import React from "react";
import BottomNav from "../components/BottomNav";
import CustomCalendar from "../components/CustomCalendar";
import PageWrapper from "../components/PageWrapper"; // PageWrapper import
import styled from "styled-components";
import DiaryListItem from "../components/DiaryListItem";
import { useState } from "react";

const mockDiaryData = [
  { date: "2025-05-14", type: "일상일기" },
  { date: "2025-05-14", type: "주제일기" },
  { date: "2025-05-15", type: "주제일기" },
];

function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayString()); // 오늘 날짜로 초기화
  const filteredDiaries = mockDiaryData.filter(
    (entry) => entry.date === selectedDate
  );

  return (
    <PageWrapper>
      <CalendarWrapper>
        <CustomCalendar
          diaryEntries={mockDiaryData}
          onDateSelect={(selectedDate) => {
            setSelectedDate(selectedDate);
          }}
          selectedDate={selectedDate}
        />
      </CalendarWrapper>
      <DiaryList>
        <div className="title2" style={{ marginBottom: "4px" }}>
          {selectedDate ? `${selectedDate}의 일기` : "일자를 선택하세요"}
        </div>
        {filteredDiaries.length > 0
          ? filteredDiaries.map((entry, idx) => (
              <DiaryListItem
                key={idx}
                date={entry.date}
                diaryType={entry.type}
              />
            ))
          : selectedDate && (
              <div className="body2">아직 오늘 일기를 작성하지 않았습니다.</div>
            )}
      </DiaryList>
      <BottomNav />
    </PageWrapper>
  );
};

export default Calendar;

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  align-items: center;
  margin: 20px;
  overflow: hidden;
`;

const DiaryList = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;

  margin: 20px;
  overflow: hidden;
  padding: 10px;
  position: relative;
`;
