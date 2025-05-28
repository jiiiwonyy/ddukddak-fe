import React from "react";
import PageWrapper from "../components/PageWrapper";
import BottomNav from "../components/BottomNav";
import styled from "styled-components";
import { LineChart, Line } from "recharts";
import BarCharts from "../components/BarCharts";
import LineCharts from "../components/LineCharts";
import { BiSolidCog } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <PropileBox>
        <PropileName className="title2">사용자 이름</PropileName>
        <SettingBox
          className="body3"
          onClick={() => {
            navigate("/setting");
          }}
        >
          <BiSolidCog />
          설정
        </SettingBox>
      </PropileBox>
      <MyPageWrapper>
        <MyPageTitle className="title3">회상 정확도</MyPageTitle>
        <GraphBox>
          <BarCharts />
        </GraphBox>
        <MyPageTitle className="title3">응답 지연 시간</MyPageTitle>
        <GraphBox>
          <LineCharts />
        </GraphBox>
      </MyPageWrapper>
      <BottomNav />
    </>
  );
};

export default MyPage;

const MyPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  align-items: center;
  overflow: hidden;
  gap: 8px;
  padding: 20px;
`;

const PropileBox = styled.div`
  width: 100%;
  height: 10vh;
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const PropileName = styled.div`
  color: #121212;
`;

const SettingBox = styled.div`
  display: inline-flex;
  padding: 0.25rem 1rem;
  align-items: center;
  gap: 3px;
  border-radius: 1.25rem;
  background: #e8e8e9;
  cursor: pointer;
`;

const MyPageTitle = styled.div`
  width: 100%;
`;

const GraphBox = styled.div`
  width: 100%;
  height: 300px;
  padding: 10px;
  background-color: white;
  border-radius: 1.25rem;
  margin: 10px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`;
