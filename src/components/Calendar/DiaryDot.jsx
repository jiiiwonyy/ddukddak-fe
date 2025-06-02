import styled from "styled-components";

const DiaryDot = ({ type }) => {
  return <Dot type={type} />;
};

export default DiaryDot;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  margin: 2px auto 0;
  border-radius: 50%;
  background-color: ${({ type }) =>
    type === "daily" ? "#DCE8FF" : type === "topic" ? "#DCD6FF" : "#FFE7E7"};
`;
