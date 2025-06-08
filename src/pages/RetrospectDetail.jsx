import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PageWrapper from "../components/PageWrapper";
import Header from "../components/Header";
import { BiChevronLeft } from "react-icons/bi";
import MainButton from "../components/MainButton";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getDiaryDetail } from "../api/diary"; // 반드시 실제 경로에 맞게 import!

const CATEGORY_MAP = {
  TIME: "시간 지남력",
  PLACE: "장소 지남력",
  MEMORY: "기억력",
};

const RetrospectDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // (1) 초기값: state에서 가져오고, 없으면 빈 값
  const [results, setResults] = useState(location.state?.results || []);
  const [feedback, setFeedback] = useState(location.state?.feedback || "");
  const [scores, setScores] = useState(location.state?.scores || []);
  const [questionsArr, setQuestionsArr] = useState(
    location.state?.questions || []
  );
  const [loading, setLoading] = useState(false);
  // (2) DB에서 fetch (새로고침/직접 진입 시)
  useEffect(() => {
    if (!location.state && id) {
      setLoading(true);
      getDiaryDetail(id)
        .then((data) => {
          // data는 axios response 전체, data.data가 실제 일기 데이터!
          setResults(data.data.chat_messages || []);
          setFeedback(data.data.final_feedback || "");
          setScores(data.data.memory_scores || []);
          // questionsArr 등도 data.data.~~에서!
          if (Array.isArray(data.data.qnas)) {
            setQuestionsArr(data.data.qnas);
          } else {
            setQuestionsArr(
              (data.data.chat_messages || []).filter(
                (m) => m.sender_type === "BOT" && m.type
              )
            );
          }
        })
        .catch((err) => {
          console.error("detail fetch error", err);
        })
        .finally(() => setLoading(false));
    }
  }, [location.state, id]);

  // (3) 로딩 중
  if (loading) return <div>불러오는 중...</div>;

  // (4) 질문 체크 함수
  let questionNum = 1;
  function isQuestionMsg(item) {
    // 실제 질문 메시지인지 체크
    return (
      item.sender_type === "BOT" &&
      item.type &&
      questionsArr.some((q) => q.question === item.message)
    );
  }

  return (
    <PageWrapper>
      <Header
        title="회상 돌아보기"
        menuIcon={BiChevronLeft}
        navigateTo={"/calendar"}
      />
      <ChatContainer>
        {results.map((item, idx) => {
          if (isQuestionMsg(item)) {
            return (
              <MessageBubble key={idx} $isUser={false}>
                <b>
                  Q{questionNum++} ({CATEGORY_MAP[item.type] || item.type})
                </b>
                <br />
                {item.message}
              </MessageBubble>
            );
          }
          if (item.sender_type === "BOT") {
            return (
              <MessageBubble key={idx} $isUser={false}>
                {item.message}
                {typeof item.score === "number" && (
                  <>
                    <br />
                    <span style={{ fontSize: 14, color: "#999" }}>
                      (점수: {item.score})
                    </span>
                  </>
                )}
              </MessageBubble>
            );
          }
          return (
            <MessageBubble key={idx} $isUser={true}>
              {item.message}
            </MessageBubble>
          );
        })}

        {/* 마지막 총평 피드백 */}
        {feedback && (
          <MessageBubble $isUser={false}>
            <b>최종 피드백</b>
            <br />
            {feedback}
          </MessageBubble>
        )}

        {/* 최종 점수 요약 */}
        {scores && scores.length > 0 && (
          <MessageBubble $isUser={false}>
            <b>카테고리별 최종 점수</b>
            <br />
            {scores.map((s, idx) => (
              <span key={idx}>
                {CATEGORY_MAP[s.category] || s.category}: {s.accuracy}점
                <br />
              </span>
            ))}
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

// Styled Components
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
