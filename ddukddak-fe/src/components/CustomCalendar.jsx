import React, { useState } from "react";
import styled from "styled-components";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import CalendarHeader from "./Calendar/CalendarHeader";
import { format, addMonths, subMonths } from "date-fns";
import DayCell from "./Calendar/DayCell";

const CustomCalendar = ({ onDateSelect, diaryEntries = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const handleDateClick = (day) => {
    const selected = format(day, "yyyy-MM-dd");
    onDateSelect(selected);
  };

  const getDiaryTypesForDate = (date) => {
    return diaryEntries
      .filter((entry) => entry.date === format(date, "yyyy-MM-dd"))
      .map((entry) => entry.type);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderDays = () => {
    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));

    const weeks = [];
    let day = startDate;

    while (day <= endDate) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const isCurrentMonth = isSameMonth(day, currentMonth);
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
        currentMonth={currentMonth}
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

export default CustomCalendar;

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
