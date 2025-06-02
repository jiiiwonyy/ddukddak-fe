import React, { useState, useEffect } from "react";
import WordGame from "./WordGame";
import NumberGame from "./NumberGame";
import ResultScreen from "./ResultScreen";

const GameApp = () => {
  const [gameType, setGameType] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // 게임 유형을 무작위로 선택
    const types = ["word", "number"];
    const random = types[Math.floor(Math.random() * types.length)];
    setGameType(random);
  }, []);

  const handleGameEnd = (gameResults) => {
    setResults(gameResults);
  };

  if (!gameType) return <div>게임을 불러오는 중...</div>;

  if (results.length > 0) {
    return <ResultScreen results={results} />;
  }

  return (
    <>
      {gameType === "word" && <WordGame onGameEnd={handleGameEnd} />}
      {gameType === "number" && <NumberGame onGameEnd={handleGameEnd} />}
    </>
  );
};

export default GameApp;
