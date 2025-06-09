import React from "react";
import styled from "styled-components";

const Button = styled.button`
  width: 100%;
  height: 3.5rem;
  padding: 0.5rem 1rem;
  justify-content: center;
  display: flex;
  align-items: center;
  background-color: #c4d9ff;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  margin-bottome: 10px;
`;

const MainButton = ({ className, text, onClick }) => {
  const buttonElement = (
    <Button className={className} onClick={onClick}>
      <div className="title3">{text}</div>
    </Button>
  );

  return buttonElement;
};

export default MainButton;
