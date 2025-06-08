import React, { useState } from "react";
import styled from "styled-components";
import { BsMic, BsMicFill } from "react-icons/bs";
import { startDailyDiary } from "../api/diary";
import { useDiaryChat } from "../api/useDiaryChat"; // Assuming this is the correct import path

const DailyDiary = () => {
  const {
    startConversation,
    chatMessage,
    isLoading,
    isListening,
    isTTSPlaying,
    handleMicClick,
    audioRef,
  } = useDiaryChat(startDailyDiary, "daily");

  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = async () => {
    setHasStarted(true);
    startConversation();
  };

  return (
    <PageWrapper>
      <FixedBackground />
      <Title className="title1">일상일기</Title>
      <ContentWrapper>
        <CharacterImage src="/assets/images/dailyCat.svg" alt="Character" />

        {!hasStarted ? (
          <StartButton onClick={handleStart}>일기 시작</StartButton>
        ) : (
          <Subtitle>{isLoading ? "로딩 중..." : chatMessage}</Subtitle>
        )}
        {hasStarted && !isTTSPlaying && (
          <OuterCircle>
            <InnerCircle onClick={handleMicClick}>
              {isListening ? (
                <BsMicFill size={32} color="#fff" />
              ) : (
                <BsMic size={32} color="#fff" />
              )}
            </InnerCircle>
          </OuterCircle>
        )}
      </ContentWrapper>
      <audio ref={audioRef} style={{ display: "none" }} />
    </PageWrapper>
  );
};

export default DailyDiary;

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const FixedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("/assets/images/dailyBG.svg") no-repeat center center;
  background-size: cover;
  z-index: 0;
`;

const Title = styled.h1`
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  flex-direction: column;
  display: flex;
  z-index: 1;
  position: relative;
`;

const CharacterImage = styled.img`
  position: relative;
  top: 0%;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  height: auto;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  background: transparent;
  border-radius: 1rem;
  margin: 20px;
  padding: 20px;
  height: calc(100vh - 40px);
  overflow-y: hidden;
  overflow-x: hidden;
`;

const Subtitle = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  font-size: 1.3rem;
  color: #212121;
  font-weight: bold;
  z-index: 2;
  margin-top: 100px;
`;

const OuterCircle = styled.div`
  width: 100px;
  height: 100px;
  background-color: #dceeff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  bottom: 20%;
`;
const InnerCircle = styled.div`
  width: 70px;
  height: 70px;
  background-color: #a9d1ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const StartButton = styled.button`
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
