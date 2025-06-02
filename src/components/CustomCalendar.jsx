import React from "react";
import styled from "styled-components";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  format,
} from "date-fns";
import CalendarHeader from "./Calendar/CalendarHeader";
import DayCell from "./Calendar/DayCell";

const CustomCalendar = ({
  currentMonth, // "YYYY-MM" (문자열)
  setCurrentMonth, // 함수 (상위에서 내려줌)
  onDateSelect,
  diaryEntries = [],
  selectedDate,
}) => {
  const today = new Date();

  // 문자열 currentMonth("YYYY-MM") → Date 객체로 변환
  const monthDate = new Date(
    Number(currentMonth.split("-")[0]),
    Number(currentMonth.split("-")[1]) - 1,
    1
  );

  const handlePrevMonth = () => {
    const prev = subMonths(monthDate, 1);
    const yyyy = prev.getFullYear();
    const mm = String(prev.getMonth() + 1).padStart(2, "0");
    setCurrentMonth(`${yyyy}-${mm}`);
  };

  const handleNextMonth = () => {
    const next = addMonths(monthDate, 1);
    const yyyy = next.getFullYear();
    const mm = String(next.getMonth() + 1).padStart(2, "0");
    setCurrentMonth(`${yyyy}-${mm}`);
  };

  const handleDateClick = (day) => {
    const selected = format(day, "yyyy-MM-dd");
    onDateSelect(selected);
  };

  const getDiaryTypesForDate = (date) => {
    return diaryEntries
      .filter((entry) => entry.date === format(date, "yyyy-MM-dd"))
      .map((entry) => entry.type);
  };

  const renderDays = () => {
    const startDate = startOfWeek(startOfMonth(monthDate));
    const endDate = endOfWeek(endOfMonth(monthDate));

    const weeks = [];
    let day = startDate;

    while (day <= endDate) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const isCurrentMonth = isSameMonth(day, monthDate);
        const isToday = isSameDay(day, today);
        const diaryTypes = getDiaryTypesForDate(day);

        days.push(
          <DayCell
            key={day.toISOString()}
            day={day}
            isCurrentMonth={isCurrentMonth}
            isToday={isToday}
            onClick={handleDateClick}
            diaryTypes={diaryTypes}
            isSelected={selectedDate === format(day, "yyyy-MM-dd")}
          />
        );

        day = addDays(day, 1);
      }

      weeks.push(<WeekRow key={day.toISOString()}>{days}</WeekRow>);
    }

    return <DaysGrid>{weeks}</DaysGrid>;
  };

  return (
    <CalendarWrapper>
      <CalendarHeader
        currentMonth={monthDate} // Date 객체로 넘김
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <Weekdays className="title3">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </Weekdays>
      {renderDays()}
    </CalendarWrapper>
  );
};

const CalendarWrapper = styled.div`
  width: 100%;
  font-family: sans-serif;
  border-radius: 1.25rem;
  ovrerflow: hidden;
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  background: #f3f7ff;
  padding: 8px 0;
  font-weight: bold;
`;

const DaysGrid = styled.div`
  display: flex;
  flex-direction: column;
  ovrerflow: hidden;
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  ovrerflow: hidden;
`;

export default CustomCalendar;
