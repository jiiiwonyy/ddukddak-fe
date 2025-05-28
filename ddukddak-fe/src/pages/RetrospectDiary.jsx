import styled from "styled-components";

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

const ThemeDiary = () => {
  return (
    <PageWrapper>
      <FixedBackground />
      <Title>회상하기</Title>
      <ContentWrapper>
        <CharacterImage
          src="/assets/images/retrospectCat.svg"
          alt="Character"
        />
        {/* 실시간 자막 출력 */}
        <Subtitle>자막위치</Subtitle>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ThemeDiary;
