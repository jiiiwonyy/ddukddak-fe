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
`;

const MainButton = ({ className, text, onClick }) => {
  return (
    <Button className={className} onClick={onClick}>
      <div className="title3">{text}</div>
    </Button>
  );
};

export default MainButton;
