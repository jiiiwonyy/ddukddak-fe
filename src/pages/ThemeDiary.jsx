import styled from "styled-components";
import { BsMic, BsMicFill } from "react-icons/bs";
import { useDiaryChat } from "../api/useDiaryChat";
import { startThemeDiary } from "../api/diary";
import { useState, useMemo } from "react";
import CustomAlert from "../components/AlertModal";
import { FiLogOut } from "react-icons/fi";

const ThemeDiary = () => {
  const {
    startConversation,
    chatMessage,
    isLoading,
    isListening,
    isTTSPlaying,
    handleMicClick,
    audioRef,
    endDiary,
    chatCount,
  } = useDiaryChat(startThemeDiary, "topic");

  const [hasStarted, setHasStarted] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const handleStart = async () => {
    setHasStarted(true);
    startConversation();
  };

  const handleEndDiary = () => {
    if (chatCount < 5) {
      setAlertMsg("아직 대화 내용이 부족해요");
      setAlertOpen(true);
      return;
    }
    endDiary();
  };

  const subtitleFontSize = useMemo(() => {
    if (!chatMessage) return "1.3rem";
    const len = chatMessage.length;
    if (len <= 30) return "1.7rem";
    if (len <= 60) return "1.5rem";
    if (len <= 80) return "1.3rem";
    return "1.2rem"; // 그 이상 더 줄일 수도 있음
  }, [chatMessage]);

  return (
    <PageWrapper>
      <FixedBackground />
      <Title>주제 일기</Title>
      {hasStarted && (
        <EndButton onClick={handleEndDiary}>
          <FiLogOut size={24} />
        </EndButton>
      )}
      <ContentWrapper>
        <CharacterImage src="/assets/images/themeCat.svg" alt="Character" />
        {!hasStarted ? (
          <StartButton className="title3" onClick={handleStart}>
            일기 시작
          </StartButton>
        ) : (
          <Subtitle style={{ fontSize: subtitleFontSize }}>
            {isLoading ? "로딩 중..." : chatMessage}
          </Subtitle>
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
      <CustomAlert
        open={alertOpen}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
      />
    </PageWrapper>
  );
};

export default ThemeDiary;

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: "Gowun Dodum", serif;
`;

const FixedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("/assets/images/themeBG.svg") no-repeat center center;
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
  width: 70%; // 캐릭터 이미지 크기
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
  height: calc(100vh - 40px); /* 상하 여백 */
  overflow-y: hidden;
  overflow-x: hidden;
`;

const Subtitle = styled.div`
  width: 100%;
  text-align: center;
  color: #212121;
  font-weight: bold;
  z-index: 2;
  margin-top: 10px;
  word-break: keep-all;
  line-height: 1.5;
  min-height: 2.2em; // 적당한 높이
  max-height: 20vh; // 너무 길지 않게 (상황에 따라 조절)
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OuterCircle = styled.div`
  width: 80px;
  height: 80px;
  background-color: rgb(235, 207, 198);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  bottom: 10%;
`;
const InnerCircle = styled.div`
  width: 66px;
  height: 66px;
  background-color: rgb(182, 128, 110);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const StartButton = styled.button`
  width: 100%;
  height: 3.5rem;
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  justify-content: center;
  display: flex;
  align-items: center;
  background-color: rgb(235, 207, 198);
  border-radius: 2rem;
  border: none;
  cursor: pointer;
`;

const EndButton = styled.button`
  position: absolute;
  top: 24px; // 상단에서 약간 여백
  right: 24px; // 오른쪽에서 약간 여백
  width: 48px; // 작게
  height: 48px;
  min-width: unset;
  min-height: unset;
  padding: 0;
  background-color: rgb(235, 207, 198);
  border-radius: 50%; // 완전 동그랗게!
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  /* 아이콘/글씨 작게 */
  font-size: 1.2rem;

  /* (optional) hover 효과 */
  &:hover {
    background-color: rgb(196, 148, 132);
  }
`;
