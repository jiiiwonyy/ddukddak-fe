import { useState, useRef, useCallback, useEffect } from "react";
import { useTTS } from "../api/useTTS";
import { sttRequest } from "../api/useSTT";
import {
  startRetrospectDiary,
  answerRetrospectDiary,
  postRetrospectDiary,
} from "../api/diary";
import { useNavigate } from "react-router-dom";
import { getLocalDateString } from "./time";

const TYPE_MAP = {
  기억력: "MEMORY",
  "장소 지남력": "PLACE_ORIENTATION",
  "시간 지남력": "TIME_ORIENTATION",
};

// 카테고리별 점수 평균 계산 함수
function computeCategoryScores(results) {
  const categoryTrials = {};
  let currentType = null;
  let currentTrial = [];

  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    // 질문(BOT, type 있을 때)
    if (item.sender_type === "BOT" && item.type) {
      if (currentType && currentTrial.length > 0) {
        if (!categoryTrials[currentType]) categoryTrials[currentType] = [];
        categoryTrials[currentType].push([...currentTrial]);
      }
      currentType = item.type;
      currentTrial = [];
    }
    // 피드백(BOT, score 있을 때)
    if (
      item.sender_type === "BOT" &&
      typeof item.score === "number" &&
      currentType
    ) {
      currentTrial.push(item.score);
    }
  }
  if (currentType && currentTrial.length > 0) {
    if (!categoryTrials[currentType]) categoryTrials[currentType] = [];
    categoryTrials[currentType].push([...currentTrial]);
  }

  const result = [];
  for (const [category, trials] of Object.entries(categoryTrials)) {
    const trialAverages = trials.map(
      (scores) => scores.reduce((sum, v) => sum + v, 0) / (scores.length || 1)
    );
    const categoryAvg =
      trialAverages.reduce((sum, v) => sum + v, 0) /
      (trialAverages.length || 1);

    // **여기서 변환 적용**
    result.push({
      category: TYPE_MAP[category] || category, // 변환 없으면 원본
      accuracy: Math.round(categoryAvg * 10) / 10,
    });
  }
  return result;
}

export const useRetrospectChat = () => {
  const { audioRef, playTTS } = useTTS();
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [diaryContent, setDiaryContent] = useState([]);
  const [subtitle, setSubtitle] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState("");
  const [hint, setHint] = useState("");
  const [waitingRetry, setWaitingRetry] = useState(false);
  const [attempt, setAttempt] = useState(1);

  const playTTSWithFlag = useCallback(
    async (text) => {
      setIsTTSPlaying(true);
      try {
        await playTTS(text);
      } finally {
        setIsTTSPlaying(false);
      }
    },
    [playTTS]
  );

  // 대화 turn별로 쌓음 (질문, 답, 피드백, score, type 등)
  const [retrospectResults, setRetrospectResults] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  // 세션 시작
  const startSession = async () => {
    setIsLoading(true);
    try {
      const res = await startRetrospectDiary();
      const qArr = res.data.questions;
      setQuestions(qArr);
      setDiaryContent(res.data.diary_content);
      setQuestionIndex(0);
      setRetrospectResults([
        { sender_type: "BOT", message: qArr[0].question, type: qArr[0].type },
      ]);
      setSessionStarted(true);
      setSessionFinished(false);

      setSubtitle(qArr[0].question); // 👉 자막 먼저!
      setIsLoading(false); // 👉 로딩 해제 바로!
      await playTTSWithFlag(qArr[0].question); // 👉 TTS 재생
    } catch {
      setSubtitle("❌ 세션 시작 실패");
      setIsLoading(false);
    }
  };

  // 마이크 녹음
  const startRecording = async () => {
    if (isListening || isTTSPlaying) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new window.MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        setIsListening(false);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm;codecs=opus",
        });
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch {
      setSubtitle("음성 녹음 오류!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  // STT 결과 → 답변 서버 전송
  const processAudio = async (audioBlob) => {
    setIsLoading(true);
    try {
      const transcript = await sttRequest(audioBlob);
      if (!transcript?.trim()) {
        setSubtitle("음성 인식 실패. 다시 시도해 주세요.");
        setIsLoading(false);
        return;
      }
      await sendAnswer(transcript);
    } catch {
      setSubtitle("음성 인식 에러!");
    }
    setIsLoading(false);
  };

  // 마이크 버튼 핸들러
  const handleMicClick = () => {
    if (isListening) stopRecording();
    else startRecording();
  };

  const sendAnswer = async (userAnswer) => {
    setIsLoading(true);
    try {
      const res = await answerRetrospectDiary({
        user_answer: userAnswer,
        question_index: questionIndex,
        questions,
        diary_content: diaryContent,
        attempt,
      });

      if (typeof res.data.question_index === "number") {
        setQuestionIndex(res.data.question_index);
      }
      if (typeof res.data.attempt === "number") {
        setAttempt(res.data.attempt);
      }

      const currType = questions[questionIndex]?.type || null;
      const isCorrect =
        res.data.is_correct === true || res.data.diagnosis === "correct";
      const isLastQuestion = !res.data.next_question;

      // === (1) 오답 3회 시 (res.data.message 존재) ===
      if (!isCorrect && res.data.message) {
        // 오답 3회시: 피드백 TTS 건너뛰고 바로 message만!
        setRetrospectResults((prev) =>
          [
            ...prev,
            { sender_type: "USER", message: userAnswer },
            {
              sender_type: "BOT",
              message: res.data.feedback,
              score: res.data.score,
              type: currType,
            },
            // next_question도 바로 추가
            res.data.next_question
              ? {
                  sender_type: "BOT",
                  message: res.data.next_question.question,
                  type: res.data.next_question.type,
                }
              : null,
          ].filter(Boolean)
        );

        setSubtitle(res.data.message);
        setWaitingRetry(false); // retry모드 종료!
        setAttempt(1); // 시도 횟수 리셋
        setIsLoading(false);
        await playTTSWithFlag(res.data.message);

        if (res.data.next_question) {
          setSubtitle(res.data.next_question.question);
          await playTTSWithFlag(res.data.next_question.question);
          setQuestionIndex(res.data.question_index ?? questionIndex + 1);
        }
      }

      // === (2) 오답 3회 미만 ===
      if (!isCorrect) {
        setRetrospectResults((prev) => [
          ...prev,
          { sender_type: "USER", message: userAnswer },
          {
            sender_type: "BOT",
            message: res.data.feedback,
            score: res.data.score,
            type: currType,
          },
        ]);
        setSubtitle(res.data.feedback);
        setHint(res.data.hint || "");
        setIsLoading(false);
        await playTTSWithFlag(res.data.feedback);
        setWaitingRetry(true);
        return;
      }

      // === (3) 정답 ===
      setHint("");
      setWaitingRetry(false);
      setAttempt(1);

      if (isLastQuestion) {
        setRetrospectResults((prev) => [
          ...prev,
          { sender_type: "USER", message: userAnswer },
          {
            sender_type: "BOT",
            message: res.data.feedback,
            score: res.data.score,
            type: currType,
          },
        ]);
        setFinalFeedback(res.data.feedback_summary || res.data.feedback || "");

        setSubtitle(res.data.feedback);
        setIsLoading(false);
        await playTTSWithFlag(res.data.feedback);

        const finishMsg = "모든 질문이 완료되었습니다!";
        setSubtitle(finishMsg);
        setIsLoading(false);
        await playTTSWithFlag(finishMsg);
        setSessionFinished(true);
        return;
      }

      // 정답이고, 아직 마지막 질문이 아니면:
      setRetrospectResults((prev) => [
        ...prev,
        { sender_type: "USER", message: userAnswer },
        {
          sender_type: "BOT",
          message: res.data.feedback,
          score: res.data.score,
          type: currType,
        },
        {
          sender_type: "BOT",
          message: res.data.next_question.question,
          type: res.data.next_question.type,
        },
      ]);

      setSubtitle(res.data.feedback);
      setIsLoading(false);
      await playTTSWithFlag(res.data.feedback);

      setSubtitle(res.data.next_question.question);
      await playTTSWithFlag(res.data.next_question.question);
    } catch {
      setSubtitle("❌ 서버 오류, 다시 시도!");
      setIsLoading(false);
    }
  };

  const endSession = useCallback(async () => {
    const diary_date = getLocalDateString();
    const category = "reminiscence";
    const title = diary_date + "의 회상";

    // chat_messages 배열로 변환
    const chat_messages = retrospectResults.map(({ sender_type, message }) => ({
      sender_type,
      message,
    }));

    // 카테고리별 점수 평균
    const scores = computeCategoryScores(retrospectResults);

    try {
      await postRetrospectDiary({
        diary_date,
        category,
        title,
        chat_messages,
        final_feedback: finalFeedback,
        scores,
      });
    } catch (e) {
      console.error("회상 QnA 저장 실패", e);
    }
    navigate("/retrospectdetail", {
      state: {
        feedback: finalFeedback,
        results: retrospectResults,
        chat_messages,
        questions,
        scores,
      },
    });
  }, [navigate, finalFeedback, retrospectResults, questions]);

  // 마지막 질문 처리 후 sessionFinished가 true가 됨
  useEffect(() => {
    if (sessionFinished) {
      endSession();
    }
  }, [sessionFinished, endSession]);

  return {
    audioRef,
    subtitle,
    isListening,
    isLoading,
    sessionStarted,
    sessionFinished,
    isTTSPlaying,
    startSession,
    handleMicClick,
    endSession,
    hint,
    waitingRetry,
    retrospectResults,
  };
};
