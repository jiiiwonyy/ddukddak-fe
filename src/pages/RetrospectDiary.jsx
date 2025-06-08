import styled from "styled-components";
import { BsMic, BsMicFill } from "react-icons/bs";
import { useRetrospectChat } from "../api/useRetrospectChat";

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
    hint,
  } = useRetrospectChat();

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
            <Subtitle>{isLoading ? "로딩 중..." : subtitle}</Subtitle>
            {hint && <HintBar>{hint}</HintBar>}
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
  width: auto; // 캐릭터 이미지 크기
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
  position: relative;
  bottom: 0%;
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  color: #212121;
  font-weight: bold;
  z-index: 2;
`;

const HintBar = styled.div`
  font-size: 1rem;
  text-align: center;
`;

const OuterCircle = styled.div`
  width: 100px;
  height: 100px;
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
  width: 70px;
  height: 70px;
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
