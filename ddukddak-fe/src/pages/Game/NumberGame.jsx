import React, { useState } from "react";
import PageWrapper from "../../components/PageWrapper";
import Header from "../../components/Header";
import { BiChevronLeft } from "react-icons/bi";
import styled from "styled-components";

function generateSequence() {
  const start = Math.floor(Math.random() * 50) + 30; // 30~80
  const step = Math.floor(Math.random() * 5) + 1; // 1~5
  return {
    sequence: [start, start - step, start - 2 * step],
    answer: start - 3 * step,
  };
}

const NumberGame = ({ onGameEnd }) => {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(Date.now());
  const [results, setResults] = useState([]);
  const [problem, setProblem] = useState(generateSequence());

  const handleSubmit = (e) => {
    e.preventDefault();
    const timeTaken = Date.now() - startTime;
    const correct = parseInt(input) === problem.answer;
    const newResult = {
      question: [...problem.sequence],
      answer: input,
      correct,
      time: timeTaken,
    };
    const next = [...results, newResult];
    setResults(next);
    setInput("");
    if (next.length === 5) {
      onGameEnd(next);
    } else {
      setProblem(generateSequence());
      setCurrent(current + 1);
      setStartTime(Date.now());
    }
  };

  return (
    <PageWrapper>
      <Header title="숫자 게임" menuIcon={BiChevronLeft} navigateTo="/home" />
      <GameWrapper>
        <ProblemCount>문제 {current + 1} / 5</ProblemCount>
        <div className="title2">다음 숫자를 입력하세요</div>
        <p className="body3">{problem.sequence.join(", ")}, ...</p>

        <NumberForm onSubmit={handleSubmit}>
          <AnswerInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="number"
            placeholder="다음 숫자 입력"
          />
          <AnswerSubmitButton disabled={input === ""}>제출</AnswerSubmitButton>
        </NumberForm>
      </GameWrapper>
    </PageWrapper>
  );
};

export default NumberGame;

const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  gap: 24px;
  padding: 20px;
`;

const ProblemCount = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const NumberForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const AnswerInput = styled.input`
  width: 80%;
  padding: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
`;
const AnswerSubmitButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #c4d9ff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    background-color: #c4d9ff;
  }
`;
