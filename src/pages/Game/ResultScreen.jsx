import React from "react";
import Header from "../../components/Header";
import PageWrapper from "../../components/PageWrapper";
import styled from "styled-components";
import MainButton from "../../components/MainButton";
import { useNavigate } from "react-router-dom";
import { postGameResult } from "../../api/game";

const ResultScreen = ({ results }) => {
  const correctCount = results.filter((r) => r.correct).length;
  const accuracy =
    results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
  const avgTime = (
    results.reduce((sum, r) => sum + r.time, 0) / results.length
  ).toFixed(0);
  const navigator = useNavigate();

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const game_date = `${yyyy}-${mm}-${dd}`;

  const data = {
    game_date,
    avg_time: Number(avgTime), // ms 단위
    accuracy, // 퍼센트 (예: 80)
  };

  const handleGoHome = async () => {
    try {
      await postGameResult(data);
    } catch (e) {
      console.error(e);
      alert("게임 결과 전송 실패");
    }
    navigator("/home");
  };

  return (
    <PageWrapper>
      <Header title="게임 결과" />
      <ResultPageWrapper>
        <p className="title2">
          정답 수: {correctCount} / {results.length}
        </p>
        <p>평균 시간: {avgTime} ms</p>
        <ProblemList>
          {results.map((r, idx) => (
            <ProblemItem key={idx}>
              <div className="title3">문제 {idx + 1}</div>{" "}
              <div className="body2">{r.question.toString()}</div>
              <div className="title3"> 입력 </div>{" "}
              <div className="body2">{r.answer}</div>
              <div className="title3"> 정답</div>{" "}
              <div className="body2">{r.correct ? "⭕" : "❌"}</div>
              <div className="title3"> 소요시간</div>{" "}
              <div className="body2">{Number(r.time).toLocaleString()} ms</div>
            </ProblemItem>
          ))}
        </ProblemList>
        <MainButton
          className="body3"
          onClick={handleGoHome}
          text="홈으로 돌아가기"
          fixed
        />
      </ResultPageWrapper>
    </PageWrapper>
  );
};

export default ResultScreen;

const ResultPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  gap: 24px;
  padding: 20px;
`;

const ProblemList = styled.ul`
  display: grid;
  width: 100%;
  padding: 0;
  row-gap: 1.0625rem;
`;
const ProblemItem = styled.li`
  display: grid;
  width: 100%;
  padding: 1.3125rem 1.4375rem;
  row-gap: 1.0625rem;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  grid-template-columns: repeat(4, minmax(0, 1fr));
  background-color: #f8f8f8;
`;
