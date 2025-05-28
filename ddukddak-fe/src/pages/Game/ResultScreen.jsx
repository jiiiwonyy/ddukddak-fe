import React from "react";
import Header from "../../components/Header";
import PageWrapper from "../../components/PageWrapper";
import styled from "styled-components";
import MainButton from "../../components/MainButton";
import { useNavigate } from "react-router-dom";

const ResultScreen = ({ results }) => {
  const correctCount = results.filter((r) => r.correct).length;
  const avgTime = (
    results.reduce((sum, r) => sum + r.time, 0) / results.length
  ).toFixed(0);
  const navigator = useNavigate();

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
              <div className="body3">{r.question.toString()}</div>
              <div className="title3"> 입력 </div>{" "}
              <div className="body3">{r.answer}</div>
              <div className="title3"> 정답</div>{" "}
              <div className="body3">{r.correct ? "⭕" : "❌"}</div>
              <div className="title3"> 소요시간</div>{" "}
              <div className="body3">{Number(r.time).toLocaleString()} ms</div>
            </ProblemItem>
          ))}
        </ProblemList>
        <CompleteButtonWrapper>
          <MainButton
            className="body3"
            onClick={() => {
              navigator("/home");
            }}
            text="홈으로 돌아가기기"
          />
        </CompleteButtonWrapper>
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

const CompleteButtonWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  width: calc(100% - 40px);
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
