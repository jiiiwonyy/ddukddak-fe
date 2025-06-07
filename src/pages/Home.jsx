import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BottomNav from "../components/BottomNav";
import PageWrapper from "../components/PageWrapper";
import HomeListItem from "../components/HomeListItem";
import { BiPencil, BiJoystick } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
// import { getMonthlyDiaries } from "../api/diary";
import CustomAlert from "../components/AlertModal";
import { getGameDate } from "../api/game";

function getTodayInfo() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const day = days[today.getDay()];
  const todayStr = `${year}-${String(month).padStart(2, "0")}-${String(
    date
  ).padStart(2, "0")}`;
  const formatted = `${month}/${date}(${day})`;
  return { year, month, date, day, todayStr, formatted };
}

const Home = () => {
  const navigate = useNavigate();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("access_token", token);
      window.history.replaceState({}, document.title, "/home");
    }
  }, []);

  // const checkTodayDiaryExists = async (category) => {
  //   const { year, month, todayStr } = getTodayInfo();
  //   const res = await getMonthlyDiaries(year, month);
  //   const diaries = res.data[todayStr] || [];
  //   return diaries.some((entry) => entry.category === category);
  // };

  const handleGameClick = async () => {
    const todayStr = getTodayInfo().todayStr;
    const res = await getGameDate(todayStr);

    try {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setAlertMsg("오늘은 이미 게임을 했어요!");
        setAlertOpen(true);
      } else {
        // 빈 리스트 (게임 기록 없음)
        navigate("/game");
      }
    } catch (error) {
      setAlertMsg("게임 기록 확인에 실패했습니다.");
      setAlertOpen(true);
      console.error(error);
    }
  };

  const handleDiaryClick = async (category, path) => {
    try {
      if (category === "daily") {
        try {
          navigate(path);
          sessionStorage.setItem("playFirstTTS", "true");
        } catch (e) {
          console.error("일상일기 시작 실패:", e);
          // 502 에러나 CORS 에러가 발생해도 페이지로 이동
          navigate(path);
        }
      } else {
        navigate(path);
        sessionStorage.setItem("playFirstTTS", "true");
      }
    } catch (e) {
      console.error(e);
      setAlertMsg("일기 작성 상태 확인에 실패했습니다.");
      setAlertOpen(true);
    }
  };

  const { formatted } = getTodayInfo();
  return (
    <PageWrapper>
      <FixedBackground />
      <ContentWrapper>
        <DateText className="title3">{formatted}</DateText>
        <ButtonGroup>
          <HomeListItem
            textTop="주제일기"
            textBottom="작성하기"
            backgroundColor="#E8E3FF"
            icon={<BiPencil />}
            onClick={() => handleDiaryClick("topic", "/theme")}
          />
          <HomeListItem
            textTop="일상일기"
            textBottom="작성하기"
            backgroundColor="#DCE8FF"
            icon={<BiPencil />}
            onClick={() => handleDiaryClick("daily", "/daily")}
          />
          <HomeListItem
            textTop="계산/언어"
            textBottom="게임하기"
            backgroundColor="#F1FBFF"
            icon={<BiJoystick />}
            onClick={handleGameClick}
          />
          <CustomAlert
            open={alertOpen}
            message={alertMsg}
            onClose={() => setAlertOpen(false)}
          />
        </ButtonGroup>
      </ContentWrapper>
      <BottomNav />
    </PageWrapper>
  );
};

export default Home;

const FixedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("/assets/images/bg.svg") no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: absolute;
  z-index: 1;
  background: white;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 1.5rem 1rem;
  height: calc(100vh - 60vh);
  overflow-y: auto;
  bottom: 0;
  width: 100%;
  overflow-x: hidden;
`;

const DateText = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;
