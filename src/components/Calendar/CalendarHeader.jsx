import React from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import styled from "styled-components";
import { format } from "date-fns";

const CalendarHeader = ({ currentMonth, onPrevMonth, onNextMonth }) => (
  <Header>
    <NavButton onClick={onPrevMonth}>
      <BiChevronLeft />
    </NavButton>
    <MonthLabel className="title2">
      {format(currentMonth, "yyyy년 M월")}
    </MonthLabel>
    <NavButton onClick={onNextMonth}>
      <BiChevronRight />
    </NavButton>
  </Header>
);

export default CalendarHeader;

const Header = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #f3f7ff;
`;

const MonthLabel = styled.div`
  font-weight: bold;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  align-items: center;
  display: flex;
`;
