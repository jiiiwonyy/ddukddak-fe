import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const HomeListItem = ({ textTop, textBottom, backgroundColor, icon, to }) => {
  const navigate = useNavigate();

  return (
    <HomeListItemWrapper
      style={{ backgroundColor }}
      onClick={() => navigate(to)}
    >
      <CardText>
        <div className="body3">{textTop}</div>
        <div className="body3">{textBottom}</div>
      </CardText>
      <Circle>{icon}</Circle>
    </HomeListItemWrapper>
  );
};

export default HomeListItem;

const HomeListItemWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 180px;
  padding: 0.875rem 0.75rem;
  flex-direction: column;
  border-radius: 0.5rem;
  cursor: pointer;
  box-sizing: border-box;

  @media screen and (max-height: 700px) {
    height: 120px;
    padding: 0.5rem;
  }
`;

const CardText = styled.div`
  color: #121212;
  text-align: left;
`;

const Circle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 12px;
  right: 10px;
  bottom: 0;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.1);

  @media screen and (max-height: 700px) {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
`;
