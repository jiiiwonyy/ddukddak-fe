import { BiChevronLeft } from "react-icons/bi";
import React from "react";
import Header from "../components/Header";
import MainButton from "../components/MainButton";
import styled, { css } from "styled-components";

const UserInfoContainer = styled.div`
  background-color: #fff;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 5rem;
`;

const UserInfoBody = styled.div`
  display: flex;
  background-color: #fff;
  flex-direction: column;
  padding: 20px;
  position: relative;
`;

const CommonStyled = css`
  display: flex;
  background-color: #fff;
  border-radius: 0.5rem;
  border: 1px solid #bbbbbe;
  padding: 0.5rem 1rem;
  height: 3.25rem;
  margin: 0.5rem 0;
  align-items: center;
`;

const StyledInput = styled.input`
  ${CommonStyled}
  width: 100%;
`;

const GenderButton = styled.button`
  ${CommonStyled}
  flex: 1 0 0;
  justify-content: center;
  align-items: center;
`;

const CompleteButtonWrapper = styled.div`
  position: fixed;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 0 1.5rem;
`;

const UserInfo = () => {
  return (
    <UserInfoContainer>
      <Header
        title="개인정보 입력"
        menuIcon={BiChevronLeft} // 아이콘을 prop으로 전달
      />
      <UserInfoBody>
        <div className="title3">이름</div>
        <StyledInput
          className="body3"
          type="text"
          placeholder="이름을 입력하세요"
        />

        <div className="title3">생년월일</div>
        <StyledInput type="date" className="body3" />
        <div className="title3">성별</div>
        <div style={{ flexDirection: "row", display: "flex", gap: "0.5rem" }}>
          <GenderButton className="body3">남자</GenderButton>
          <GenderButton className="body3">여자</GenderButton>
        </div>
        <CompleteButtonWrapper>
          <MainButton
            text="입력 완료"
            onClick={() => console.log("입력 완료")}
          />
        </CompleteButtonWrapper>
      </UserInfoBody>
    </UserInfoContainer>
  );
};

export default UserInfo;
