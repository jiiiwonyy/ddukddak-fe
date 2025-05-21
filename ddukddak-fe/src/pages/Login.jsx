import React from "react";
import styled from "styled-components";
import PageWrapper from "../components/PageWrapper";

const Login = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLogin = () => {
    window.location.href = link;
  };

  return (
    <PageWrapper>
      <LoginContainer>
        <img src="assets/images/login.svg" alt="Login" />
        <p className="title1">서비스이름</p>
        <KakaoButton className="title3" onClick={handleLogin}>
          <img src="assets/images/KakaoTalk.svg" alt="loginButton" /> 카카오로
          로그인하기
        </KakaoButton>
      </LoginContainer>
    </PageWrapper>
  );
};
export default Login;

const LoginContainer = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 0 20px;
  margin-top: 100px;
`;

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
