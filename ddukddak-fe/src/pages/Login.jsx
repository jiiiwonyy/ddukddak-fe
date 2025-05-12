import React from "react";
import styled from "styled-components";
import PageWrapper from "../components/PageWrapper";

const KakaoButton = styled.button`
  width: 100%;
  height: 3.5rem;
  padding: 0.5rem 1rem;
  justify-content: center;
  display: flex;
  align-items: center;
  background-color: #ffe81a;
  border-radius: 2rem;
  border: none;
`;

const LoginContainer = styled(PageWrapper)`
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 0 20px;
`;

const Login = () => {
  return (
    <LoginContainer>
      <img src="assets/images/login.svg" alt="Login" />
      <p className="title1">서비스이름</p>
      <KakaoButton className="title3">
        <img src="assets/images/KakaoTalk.svg" alt="loginButton" /> 카카오로
        로그인하기
      </KakaoButton>
    </LoginContainer>
  );
};
export default Login;
