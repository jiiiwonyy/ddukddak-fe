import { BiChevronLeft } from "react-icons/bi";
import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MainButton from "../components/MainButton";
import styled, { css } from "styled-components";
import PageWrapper from "../components/PageWrapper";

const UserInfo = () => {
  // const navigate = useNavigate();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = () => {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   console.error("토큰이 없습니다.");
    //   return;
    // }
    // fetch("https://nabiya.site/api/user/info", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({
    //     name,
    //     birthDate,
    //     gender,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data.result) {
    //       navigate("/home");
    //     } else {
    //       console.error("개인정보 저장 실패", data);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("개인정보 저장 중 오류 발생", error);
    //   });
  };

  return (
    <UserInfoContainer>
      <Header
        title="개인정보 입력"
        menuIcon={BiChevronLeft}
        navigateTo="/login"
      />
      <UserInfoBody>
        <div className="title3">이름</div>
        <StyledInput
          className="body3"
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="title3">생년월일</div>
        <StyledInput
          type="date"
          className="body3"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        <div className="title3">성별</div>
        <div style={{ flexDirection: "row", display: "flex", gap: "0.5rem" }}>
          <GenderButton
            className="body3"
            isSelected={gender === "male"}
            onClick={() => setGender("male")}
          >
            남자
          </GenderButton>
          <GenderButton
            className="body3"
            isSelected={gender === "female"}
            onClick={() => setGender("female")}
          >
            여자
          </GenderButton>
        </div>
        <MainButton text="입력 완료" onClick={handleSubmit} />
      </UserInfoBody>
    </UserInfoContainer>
  );
};

export default UserInfo;

const UserInfoContainer = styled(PageWrapper)`
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
  flex: 1;
  justify-content: center;
  background-color: ${(props) => (props.isSelected ? "#DCE8FF" : "#fff")};
  cursor: pointer;
`;

const CompleteButtonWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  width: calc(100% - 40px);
`;
