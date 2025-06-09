import React from "react";
import BottomNav from "../components/BottomNav";
import CustomCalendar from "../components/CustomCalendar";
import PageWrapper from "../components/PageWrapper";
import styled from "styled-components";
import DiaryListItem from "../components/DiaryListItem";
import { useState, useEffect } from "react";
import { getMonthlyDiaries } from "../api/diary";

function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatKoreanDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayString()); // 오늘 날짜로 초기화
  const [monthlyDiaries, setMonthlyDiaries] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  useEffect(() => {
    const [year, month] = currentMonth.split("-");
    setLoading(true);
    getMonthlyDiaries(Number(year), Number(month))
      .then((res) => setMonthlyDiaries(res.data || {}))
      .catch((error) => {
        console.error("API 에러:", error);
        setMonthlyDiaries({});
      })
      .finally(() => setLoading(false));
  }, [currentMonth]);

  const filteredDiaries = monthlyDiaries[selectedDate] || [];

  return (
    <PageWrapper>
      <CalendarWrapper>
        <CustomCalendar
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          diaryEntries={Object.entries(monthlyDiaries).flatMap(([, diaries]) =>
            diaries.map((entry) => ({
              date: entry.diary_date,
              type: entry.category,
            }))
          )}
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
        />
      </CalendarWrapper>
      <DiaryList>
        <div className="title2" style={{ marginBottom: "4px" }}>
          {selectedDate
            ? `${formatKoreanDate(selectedDate)}의 일기`
            : "일자를 선택하세요"}
        </div>
        {loading ? (
          <div style={{ marginTop: "12px" }} className="body3">
            불러오는 중...
          </div>
        ) : filteredDiaries.length > 0 ? (
          filteredDiaries.map((entry) => (
            <DiaryListItem
              key={entry.id}
              id={entry.id}
              date={entry.diary_date}
              diarytype={entry.category}
              title={entry.title}
            />
          ))
        ) : (
          <div style={{ marginTop: "12px" }} className="body3">
            작성된 일기가 없어요
          </div>
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

  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 70px;
  overflow: hidden;
  padding: 10px;
  position: relative;
`;
