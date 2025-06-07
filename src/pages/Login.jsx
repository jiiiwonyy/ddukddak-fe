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
    const loginFlow = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const profile = params.get("is_profile_completed");

      if (token) {
        setToken(token);
        try {
          const profileRes = await instance.get("/users/profile/");
          const userId = profileRes.data.id;
          setUserId(userId);

          // 1. 먼저 로그인 상태로 바꿔주고 홈으로 이동
          dispatch(login());
          navigate(profile === "false" ? "/userinfo" : "/home", {
            replace: true,
          });

          // 2. 그 다음, AI 토큰 발급은 await 없이 "백그라운드"로 시도 (에러 나도 무시)
          dailyInstance
            .post("/auth/token", { user_id: userId })
            .then((aiTokenRes) => {
              if (aiTokenRes.data?.token) {
                localStorage.setItem("ai_jwt_token", aiTokenRes.data.token);
              }
            })
            .catch((err) => {
              console.error("AI 토큰 발급 실패:", err);
              // alert("AI 서버 점검 중! 챗봇/음성기능이 제한될 수 있습니다.");
            });
        } catch (error) {
          // 프로필 호출 실패시
          console.error("프로필 호출 실패:", error);
          dispatch(logout());
          navigate("/login", { replace: true });
        }
      } else {
        // 새로고침/이미 로그인 체크
        const storedToken = getToken();
        const storedUserId = getUserId();
        if (storedToken && storedUserId) {
          dispatch(login());
          navigate(profile === "false" ? "/userinfo" : "/home", {
            replace: true,
          });
        } else {
          dispatch(logout());
          navigate("/login", { replace: true });
        }
      }
    };

    loginFlow();
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
