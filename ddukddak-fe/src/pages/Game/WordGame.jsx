import React, { useState, useMemo } from "react";
import PageWrapper from "../../components/PageWrapper";
import Header from "../../components/Header";
import { BiChevronLeft } from "react-icons/bi";
import styled from "styled-components";

const WORDS = [
  "고양이",
  "자동차",
  "비행기",
  "연필꽂이",
  "냉장고",
  "의자",
  "컴퓨터",
  "지우개",
  "창문",
  "칠판",
  "전화기",
  "물고기",
  "선풍기",
  "전등",
  "돋보기",
  "모자",
  "책상",
  "우산",
  "시계",
  "바지",
  "구두",
  "운동화",
  "양말",
  "연필",
  "지갑",
  "안경",
  "커튼",
  "도서관",
  "놀이터",
  "학교",
  "병원",
  "세탁기",
  "장난감",
  "손수건",
  "편지지",
  "블라우스",
  "반팔티",
  "노트북",
  "손목시계",
  "주전자",
  "커피잔",
  "택시",
  "버스",
  "지하철",
  "냄비",
  "라면",
  "손톱깎이",
  "휴대폰",
  "배터리",
  "가방끈",
];

// Fisher-Yates shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleWord(word) {
  if (word.length < 2) return word;
  let arr = word.split("");
  let shuffled = "";
  do {
    arr = shuffleArray(arr);
    shuffled = arr.join("");
  } while (shuffled === word);
  return shuffled;
}

const WordGame = ({ onGameEnd }) => {
  // 문제 배열을 한 번만 섞어서 저장
  const [shuffledWords] = useState(() => shuffleArray(WORDS));
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(Date.now());
  const [results, setResults] = useState([]);

  const word = shuffledWords[current];
  const shuffled = useMemo(() => shuffleWord(word), [word]);

  const renderCardWord = (word) =>
    word.split("").map((char, idx) => <CharCard key={idx}>{char}</CharCard>);

  const handleSubmit = (e) => {
    e.preventDefault();
    const timeTaken = Date.now() - startTime;
    const correct = input === word;
    const newResult = {
      question: shuffled,
      answer: input,
      correct,
      time: timeTaken,
    };
    const next = [...results, newResult];
    setResults(next);
    setInput("");
    setStartTime(Date.now());
    if (next.length === 5) {
      onGameEnd(next);
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <PageWrapper>
      <Header
        title="단어 맞추기 게임"
        menuIcon={BiChevronLeft}
        navigateTo="/home"
      />
      <GameWrapper>
        <ProblemCount>문제 {current + 1} / 5</ProblemCount>
        <div className="title2">주어진 단어를 바르게 고쳐주세요.</div>

        <WordCardRow>{renderCardWord(shuffled)}</WordCardRow>
        <WordForm onSubmit={handleSubmit}>
          <AnswerInput
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="정답을 입력하세요"
          />
          <AnswerSubmitButton disabled={input === ""}>다음</AnswerSubmitButton>
        </WordForm>
      </GameWrapper>
    </PageWrapper>
  );
};

export default WordGame;

const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  gap: 8px;
  padding: 20px;
`;
const ProblemCount = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const WordCardRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem;
  justify-content: center;
`;

const CharCard = styled.div`
  background: #e8e8e9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1.2rem 1.5rem;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WordForm = styled.form`
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
