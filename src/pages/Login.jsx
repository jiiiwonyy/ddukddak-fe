import React, { useEffect } from "react";
import styled from "styled-components";
import PageWrapper from "../components/PageWrapper";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/modules/authSlice";
import { setToken, getToken, setUserId, getUserId } from "../api/auth"; // AI 서버 인증용
// import axios from "../api/axiosInstance"; // axios 인스턴스
import instance from "../api/axiosInstance"; // 백엔드 인증용
import dailyInstance from "../api/dailyInstance";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const profile = params.get("is_profile_completed");

    // 1. 로그인 콜백(카카오 인증 성공) 케이스
    if (token) {
      setToken(token);

      // 2. 토큰으로 프로필 호출 → user_id 저장
      instance.get("/users/profile/").then(async (res) => {
        const userId = res.data.id; // 'id'가 user_id
        setUserId(userId);

        try {
          const aiTokenRes = await dailyInstance.post("/auth/token", {
            user_id: userId,
          });

          // AI 토큰 저장
          if (aiTokenRes.data && aiTokenRes.data.token) {
            localStorage.setItem("ai_jwt_token", aiTokenRes.data.token);
          }

          dispatch(login());

          if (profile === "false") {
            navigate("/userinfo", { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
        } catch (error) {
          console.error("AI 토큰 발급 실패:", error);
          // AI 토큰 발급 실패해도 로그인은 진행
          dispatch(login());
          navigate("/home", { replace: true });
        }
      });
    } else {
      // 3. 새로고침/이미 로그인된 상태 체크
      const storedToken = getToken();
      const storedUserId = getUserId();

      if (storedToken && storedUserId) {
        dispatch(login());
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
