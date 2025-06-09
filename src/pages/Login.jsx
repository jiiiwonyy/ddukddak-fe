import React, { useEffect } from "react";
import styled from "styled-components";
import PageWrapper from "../components/PageWrapper";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/modules/authSlice";
import { setToken, getToken, setUserId, getUserId } from "../api/auth";
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

          // ★ 1. AI 토큰 발급을 반드시 await로!
          let aiToken = "";
          try {
            const aiTokenRes = await dailyInstance.post("/auth/token", {
              user_id: userId,
            });
            aiToken = aiTokenRes.data?.token;
            if (aiToken) {
              localStorage.setItem("ai_jwt_token", aiToken);
            }
          } catch (err) {
            console.error("AI 토큰 발급 실패:", err);
          }

          // ★ 2. 둘 다 있을 때만 로그인 성공
          if (token && aiToken) {
            dispatch(login());
            navigate(profile === "false" ? "/userinfo" : "/home", {
              replace: true,
            });
          } else {
            // 둘 중 하나라도 없으면
            localStorage.removeItem("access_token");
            localStorage.removeItem("ai_jwt_token");
            dispatch(logout());
            navigate("/login", { replace: true });
          }
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
        const aiToken = localStorage.getItem("ai_jwt_token");
        if (storedToken && storedUserId && aiToken) {
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
