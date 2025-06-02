import React, { useEffect } from "react";
import styled from "styled-components";
import PageWrapper from "../components/PageWrapper";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/modules/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("access_token");
    const profile = params.get("is_profile_completed");

    if (token) {
      localStorage.setItem("access_token", token);
      dispatch(login());
      if (profile === "false") {
        navigate("/userinfo", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } else {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        dispatch(login());
        // 이미 로그인된 경우에도 프로필 여부 체크
        if (profile === "false") {
          navigate("/userinfo", { replace: true });
        } else {
          if (location.pathname === "/login") {
            navigate("/home", { replace: true });
          }
        }
      } else {
        dispatch(logout());
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      }
    }
  }, [location.pathname, location.search, navigate, dispatch]);

  const handleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_KAKAO_REDIRECT_URI
    }/api/oauth/login/`;
  };

  return (
    <PageWrapper>
      <LoginContainer>
        <img src="assets/images/login.svg" alt="Login" />
        <p className="title1">나비야</p>
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
  cursor: pointer;
`;
