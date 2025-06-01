import Header from "../components/Header";
import { BiChevronLeft, BiLogOut } from "react-icons/bi";
import PageWrapper from "../components/PageWrapper";
import styled, { css } from "styled-components";
import MainButton from "../components/MainButton";
import { useEffect, useState } from "react";
import { getUserProfile } from "../api/user";

const SettingPage = () => {
  const [userName, setUserName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    getUserProfile()
      .then((res) => {
        setUserName(res.data.name || "");
        setBirthDate(res.data.birth_date || "");
        setGender(
          res.data.gender === "male"
            ? "남자"
            : res.data.gender === "female"
            ? "여자"
            : ""
        );
      })
      .catch(() => {
        setUserName("");
        setBirthDate("");
        setGender("");
      });
  }, []);

  return (
    <PageWrapper>
      <Header
        title="나의 정보 수정"
        menuIcon={BiChevronLeft}
        navigateTo="/mypage"
      />
      <SettingPageWrapper>
        <div className="title3">이름</div>
        <InfoDiv className="body3">{userName}</InfoDiv>
        <div className="title3">생년월일</div>
        <InfoDiv className="body3">{birthDate}</InfoDiv>
        <div className="title3">성별</div>
        <InfoDiv className="body3">{gender}</InfoDiv>
        <MainButton
          onClick={() => {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          }}
          text="로그아웃 하기"
          fixed
        />
      </SettingPageWrapper>
    </PageWrapper>
  );
};

export default SettingPage;

const SettingPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
  gap: 8px;
  padding: 20px;
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

const InfoDiv = styled.div`
  ${CommonStyled}
  width: 100%;
`;
