import { BiChevronLeft } from "react-icons/bi";
import React, { useState } from "react";
import Header from "../components/Header";
import MainButton from "../components/MainButton";
import styled, { css } from "styled-components";
import PageWrapper from "../components/PageWrapper";
import { saveUserProfile } from "../api/user";
import { useNavigate } from "react-router-dom";
import { getLocalDateString } from "../api/time";

const SPECIAL_OPTION = "가족이 없습니다 / 기입하고 싶지 않습니다";
const FAMILY_OPTIONS = ["배우자", "자식", "엄마", "아빠", SPECIAL_OPTION];

const UserInfo = () => {
  const [name, setName] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [selectedFamily, setSelectedFamily] = useState([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isMarried, setIsMarried] = useState("");

  const today = getLocalDateString(); // "YYYY-MM-DD" 형식

  const navigate = useNavigate();

  // 체크박스 클릭 시
  const handleFamilyCheck = (relation) => {
    if (relation === SPECIAL_OPTION) {
      setSelectedFamily([SPECIAL_OPTION]);
    } else {
      setSelectedFamily((prev) => {
        // SPECIAL_OPTION이 선택되어 있으면 해제
        const filtered = prev.filter((item) => item !== SPECIAL_OPTION);
        // 이미 선택된 경우 무시, 아니면 추가
        return filtered.includes(relation) ? filtered : [...filtered, relation];
      });
    }
  };

  // 체크 해제 시
  const handleFamilyUncheck = (relation) => {
    setSelectedFamily((prev) => prev.filter((item) => item !== relation));
  };

  // 체크박스 상태
  const isChecked = (relation) => selectedFamily.includes(relation);

  const handleMarried = (married) => {
    setIsMarried(married);
  };

  // 필수 입력값 검증
  const isNameValid = name.trim() !== "";
  const isGenderValid = gender !== "";
  const isFamilyValid = selectedFamily.length > 0;
  const isBirthDateValid = birth_date.trim() !== "" && birth_date <= today;

  const isMarriedValid = isMarried !== "";
  const isFormValid =
    isNameValid &&
    isBirthDateValid &&
    isGenderValid &&
    isMarriedValid &&
    isFamilyValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isFormValid || birth_date > today) return;
    const data = {
      name,
      birth_date,
      gender,
      married: isMarried,
      family_relationship: selectedFamily.includes(SPECIAL_OPTION)
        ? ""
        : selectedFamily.join(","),
    };
    try {
      const response = await saveUserProfile(data);
      if (response.status === 200) {
        navigate("/home");
      } else {
        alert("저장에 실패했습니다.");
      }
    } catch (error) {
      alert("저장에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <UserInfoContainer>
      <Header
        title="개인정보 입력"
        menuIcon={BiChevronLeft}
        navigateTo="/login"
      />
      <UserInfoBody as="form" onSubmit={handleSubmit}>
        <div className="title3">이름</div>
        <StyledInput
          className="body3"
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          $invalid={!isNameValid && submitAttempted}
        />
        {!isNameValid && submitAttempted && (
          <ErrorMsg>이름을 입력해주세요.</ErrorMsg>
        )}
        <div className="title3">생년월일</div>
        <StyledInput
          type="date"
          className="body3"
          value={birth_date}
          onChange={(e) => setBirthDate(e.target.value)}
          $invalid={!isBirthDateValid && submitAttempted}
        />
        {birth_date.trim() === "" && submitAttempted && (
          <ErrorMsg>생년월일을 입력해주세요.</ErrorMsg>
        )}
        {birth_date > today && submitAttempted && (
          <ErrorMsg>옳지 않은 날짜입니다.</ErrorMsg>
        )}

        <div className="title3">성별</div>
        <div style={{ flexDirection: "row", display: "flex", gap: "0.5rem" }}>
          <GenderButton
            className="body3"
            $isSelected={gender === "male"}
            onClick={() => setGender("male")}
            type="button"
          >
            남자
          </GenderButton>
          <GenderButton
            className="body3"
            $isSelected={gender === "female"}
            onClick={() => setGender("female")}
            type="button"
          >
            여자
          </GenderButton>
        </div>
        {!isGenderValid && submitAttempted && (
          <ErrorMsg>성별을 선택해주세요.</ErrorMsg>
        )}
        <div className="title3">결혼 여부</div>
        <div style={{ flexDirection: "row", display: "flex", gap: "0.5rem" }}>
          <GenderButton
            className="body3"
            $isSelected={isMarried === "married"}
            onClick={() => handleMarried("married")}
            type="button"
          >
            기혼
          </GenderButton>
          <GenderButton
            className="body3"
            $isSelected={isMarried === "nomarried"}
            onClick={() => handleMarried("nomarried")}
            type="button"
          >
            미혼
          </GenderButton>
        </div>
        {!isMarriedValid && submitAttempted && (
          <ErrorMsg>결혼 여부를 선택해주세요.</ErrorMsg>
        )}

        <div className="title3">가족 관계</div>
        <FamilyInfoBox className="body3">
          <FamilyInfoImg src="\assets\icons\family-heart.svg" />
          함께 거주중이거나 가까운 가족 관계를 선택해주세요.
        </FamilyInfoBox>
        <FamilyCheckboxGroup className="body3">
          {FAMILY_OPTIONS.map((relation) => (
            <CheckboxLabel key={relation}>
              <HiddenCheckbox
                type="checkbox"
                checked={isChecked(relation)}
                onChange={(e) =>
                  e.target.checked
                    ? handleFamilyCheck(relation)
                    : handleFamilyUncheck(relation)
                }
              />
              <CustomCheckbox $checked={isChecked(relation)} />
              <span>{relation}</span>
            </CheckboxLabel>
          ))}
        </FamilyCheckboxGroup>
        {!isFamilyValid && submitAttempted && (
          <ErrorMsg>가족 관계를 최소 1개 이상 선택해주세요.</ErrorMsg>
        )}

        <MainButton text="입력 완료" type="submit" disabled={!isFormValid} />
      </UserInfoBody>
    </UserInfoContainer>
  );
};

export default UserInfo;

const UserInfoContainer = styled(PageWrapper)`
  padding-bottom: 5rem;
  overflow: auto;
`;

const UserInfoBody = styled.div`
  display: flex;
  background-color: #fff;
  flex-direction: column;
  padding: 20px;
  position: relative;
  gap: 4px;
  display: flex;
  flex-direction: column;
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
  border: 1.5px solid ${({ $invalid }) => ($invalid ? "#e13535" : "#bbbbbe")};
  &:focus {
    outline: none;
    border-color: ${({ $invalid }) => ($invalid ? "#e13535" : "#7daaff")};
  }
`;

const ErrorMsg = styled.div`
  color: #e13535;
  font-size: 0.95rem;
  margin: -0.3rem 0 0.5rem 0.2rem;
`;

const GenderButton = styled.button`
  ${CommonStyled}
  flex: 1;
  justify-content: center;
  background-color: ${({ $isSelected }) => ($isSelected ? "#DCE8FF" : "#fff")};
  cursor: pointer;
`;

const FamilyInfoBox = styled.div`
  margin: 1rem 0;
  display: flex;
  padding: 1rem 1.25rem;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;
  border-radius: 0.5rem;
  background: #e7f0ff;
  justify-content: center;
`;

const FamilyInfoImg = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  aspect-ratio: 1/1;
`;

const FamilyCheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-direction: column;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
`;

const HiddenCheckbox = styled.input`
  display: none;
`;

const CustomCheckbox = styled.span`
  width: 20px;
  height: 20px;
  border: 2px solid #7daaff;
  border-radius: 6px;
  background: ${({ $checked }) => ($checked ? "#7daaff" : "#fff")};
  display: inline-block;
  margin-right: 8px;
  transition: background 0.2s;
  position: relative;

  &::after {
    content: "";
    display: ${({ $checked }) => ($checked ? "block" : "none")};
    position: absolute;
    left: 4px;
    width: 6px;
    height: 8px;
    border: solid #fff;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
`;
