import React from "react";
import styled from "styled-components";
import PageWrapper from "../components/PageWrapper";
import Header from "../components/Header";
import { BiChevronLeft } from "react-icons/bi";
import MainButton from "../components/MainButton";
import { useNavigate, useLocation } from "react-router-dom";

// 챗봇-style로 결과 펼치기
const RetrospectDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 훅에서 navigate 시 state로 넘긴 값 받아옴
  const results = location.state?.results || [];
  const feedback = location.state?.feedback || "";
  // (통계용) 전체 questions는 location.state?.questions로 받음

  // 챗봇-style로 messages 배열 만들기 (bot→user→bot→user…)
  const messages = [];
  results.forEach((item, idx) => {
    messages.push(
      {
        id: idx * 3 + 1,
        sender: "bot",
        text: `Q${idx + 1} (${item.type}): ${item.question}`,
      },
      {
        id: idx * 3 + 2,
        sender: "user",
        text: item.user_answer || "응답 없음",
      },
      {
        id: idx * 3 + 3,
        sender: "bot",
        text: `📝 피드백: ${item.feedback}${
          item.hint ? `\n💡 힌트: ${item.hint}` : ""
        }\n${
          item.is_correct === false ? "정답: " + item.correct_answer : ""
        }\n점수: ${item.score}`,
      }
    );
  });

  return (
    <PageWrapper>
      <Header
        title="회상 돌아보기"
        menuIcon={BiChevronLeft}
        navigateTo={"/calendar"}
      />
      <ChatContainer>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} $isUser={msg.sender === "user"}>
            {msg.text.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </MessageBubble>
        ))}

        {/* 마지막 총평 피드백 등 (필요하다면) */}
        {feedback && (
          <MessageBubble $isUser={false}>
            <b>최종 피드백</b>
            <br />
            {feedback}
          </MessageBubble>
        )}

        <MainButton
          text="홈으로 돌아가기"
          onClick={() => {
            navigate("/home");
          }}
          fixed
        />
      </ChatContainer>
    </PageWrapper>
  );
};

export default RetrospectDetail;

// Styled Components (기존과 동일)
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  align-items: center;
  margin: 20px;
  gap: 8px;
  overflow-y: auto;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  margin: 8px 0;
  padding: 12px 16px;
  border-radius: 20px;
  background-color: ${({ $isUser }) => ($isUser ? "#D0E1FF" : "#ECECEC")};
  align-self: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
  color: #333;
  font-size: 16px;
  line-height: 1.4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: pre-line;
`;
