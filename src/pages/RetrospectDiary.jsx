import styled from "styled-components";
import { BsMic, BsMicFill } from "react-icons/bs";
import { useRetrospectChat } from "../api/useRetrospectChat";
import { useMemo } from "react";

const RetrospectDiary = () => {
  const {
    audioRef,
    subtitle,
    isListening,
    isLoading,
    sessionStarted,
    startSession,
    handleMicClick,
    isTTSPlaying,
  } = useRetrospectChat();

  const subtitleFontSize = useMemo(() => {
    if (!subtitle) return "1.3rem";
    const len = subtitle.length;
    if (len <= 30) return "1.5rem";
    if (len <= 60) return "1.3rem";
    if (len <= 80) return "1.2rem";
    return "1.2rem"; // 그 이상 더 줄일 수도 있음
  }, [subtitle]);

  return (
    <PageWrapper>
      <FixedBackground />
      <Title>회상하기</Title>
      <ContentWrapper>
        <CharacterImage
          src="/assets/images/retrospectCat.svg"
          alt="Character"
        />

        {!sessionStarted ? (
          <StartButton
            className="title3"
            onClick={startSession}
            disabled={isLoading}
          >
            {isLoading ? "로딩 중..." : "일기 시작"}
          </StartButton>
        ) : (
          <>
            {/* 캐릭터의 말(자막) */}
            <Subtitle style={{ fontSize: subtitleFontSize }}>
              {isLoading ? "로딩 중..." : subtitle}
            </Subtitle>
            {/* 마이크 버튼 */}
            {!isTTSPlaying && (
              <OuterCircle>
                <InnerCircle onClick={handleMicClick} $listening={isListening}>
                  {isListening ? (
                    <BsMicFill size={32} color="#fff" />
                  ) : (
                    <BsMic size={32} color="#fff" />
                  )}
                </InnerCircle>
              </OuterCircle>
            )}
          </>
        )}
      </ContentWrapper>
      <audio ref={audioRef} style={{ display: "none" }} />
    </PageWrapper>
  );
};

export default RetrospectDiary;

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
  margin-top: 20px;
  word-break: keep-all;
  line-height: 1.5;
  min-height: 2.2em; // 적당한 높이
  max-height: 20vh; // 너무 길지 않게 (상황에 따라 조절)
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HintBar = styled.div`
  font-size: 1rem;
  text-align: center;
`;

const OuterCircle = styled.div`
  width: 80px;
  height: 80px;
  background-color: rgb(247, 202, 191);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  bottom: 15%;
`;
const InnerCircle = styled.div`
  width: 66px;
  height: 66px;
  background-color: rgb(206, 137, 120);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const StartButton = styled.button`
  margin-top: 2rem;
  width: 100%;
  height: 3.5rem;
  padding: 0.5rem 1rem;
  justify-content: center;
  display: flex;
  align-items: center;
  background-color: rgb(206, 137, 120);
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  color: white;
`;
