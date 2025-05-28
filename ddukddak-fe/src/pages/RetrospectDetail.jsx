import React from "react";
import styled from "styled-components";
import PageWrapper from "../components/PageWrapper";
import Header from "../components/Header";
import { BiChevronLeft } from "react-icons/bi";
import MainButton from "../components/MainButton";

const messages = [
  { id: 1, sender: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" },
  { id: 2, sender: "user", text: "오늘 날씨 어때?" },
  { id: 3, sender: "bot", text: "오늘은 맑고 화창한 날씨예요 ☀️" },
];

const RetrospectDetail = () => {
  return (
    <PageWrapper>
      <Header
        title="회상 돌아보기"
        menuIcon={BiChevronLeft}
        navigateTo={"/calendar"} // 아이콘을 prop으로 전달
      />
      <ChatContainer>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} isUser={msg.sender === "user"}>
            {msg.text}
          </MessageBubble>
        ))}
        <MainButton text="홈으로 돌아가기" />
      </ChatContainer>
    </PageWrapper>
  );
};

export default RetrospectDetail;

// 💬 스타일 컴포넌트
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
  background-color: ${(props) => (props.isUser ? "#D0E1FF" : "#ECECEC")};
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  color: #333;
  font-size: 16px;
  line-height: 1.4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
