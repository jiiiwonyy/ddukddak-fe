import { useState, useRef, useEffect, useCallback } from "react";
import { useTTS } from "../api/useTTS";
import { sttRequest } from "../api/useSTT";
import {
  startRetrospectDiary,
  answerRetrospectDiary,
  postRetrospectDiary,
} from "../api/diary";
import { useNavigate } from "react-router-dom";

export const useRetrospectChat = () => {
  const { audioRef, playTTS } = useTTS();
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [diaryContent, setDiaryContent] = useState([]);
  const [subtitle, setSubtitle] = useState(""); // 캐릭터 자막(한 줄)
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState(null);
  const [hint, setHint] = useState("");
  const [waitCorrectAnswer, setWaitCorrectAnswer] = useState(false);
  const [pendingNextQuestion, setPendingNextQuestion] = useState(null);

  const [retrospectResults, setRetrospectResults] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  // 1. 회상 세션 시작
  const startSession = async () => {
    setIsLoading(true);
    try {
      const res = await startRetrospectDiary();
      const qArr = res.data.questions;
      setQuestions(qArr);
      setDiaryContent(res.data.diary_content);
      setQuestionIndex(0);
      setRetrospectResults([]);
      setSessionStarted(true);
      setSessionFinished(false);
      setSubtitle(qArr[0].question);
      await playTTS(qArr[0].question);
    } catch {
      setSubtitle("❌ 세션 시작 실패");
    }
    setIsLoading(false);
  };

  // 마이크 녹음 시작 (공통)
  const startRecording = async () => {
    if (isListening) return;
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
        // 분기: 일반 답변 STT/정답(STT) 구분
        if (waitCorrectAnswer) {
          await processCorrectAnswerAudio(audioBlob);
        } else {
          await processAnswerAudio(audioBlob);
        }
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

  // 답변 STT → 서버에 답변 보내기
  const processAnswerAudio = async (audioBlob) => {
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

  // "정답(STT)" 오디오 처리
  const processCorrectAnswerAudio = async (audioBlob) => {
    setIsLoading(true);
    try {
      await sttRequest(audioBlob);
      // 여기에 정답에 대한 저장/추가 처리 필요하면 추가!
      setWaitCorrectAnswer(false);
      setHint("");
      if (pendingNextQuestion) {
        setQuestionIndex((prev) => prev + 1);
        setSubtitle(pendingNextQuestion.question);
        await playTTS(pendingNextQuestion.question);
        setPendingNextQuestion(null);
      } else {
        setSessionFinished(true);
        setFinalFeedback(finalFeedback); // 이미 세팅된 값 재사용(필요에 따라 보완)
        setSubtitle("모든 질문이 완료되었습니다!");
        await playTTS("모든 질문이 완료되었습니다!");
      }
    } catch {
      setSubtitle("정답 음성 인식 에러!");
    }
    setIsLoading(false);
  };

  // 답변 서버 전송 및 피드백+힌트+정답(STT) 대기
  const sendAnswer = async (userAnswer) => {
    setIsLoading(true);
    try {
      const res = await answerRetrospectDiary({
        user_answer: userAnswer,
        question_index: questionIndex,
        questions,
        diary_content: diaryContent,
      });

      // 결과 누적
      setRetrospectResults((prev) => [
        ...prev,
        {
          question: questions[questionIndex].question,
          type: questions[questionIndex].type,
          correct_answer: questions[questionIndex].answer,
          user_answer: userAnswer,
          is_correct: res.data.is_correct,
          feedback: res.data.feedback,
          hint: res.data.hint,
          score: res.data.score,
        },
      ]);

      // setSubtitle(res.data.feedback);
      // await playTTS(res.data.feedback);

      setHint(res.data.hint || "");

      // next_question을 바로 TTS하지 않고 "정답을 말씀해 주세요" 안내
      if (res.data.next_question) {
        setPendingNextQuestion(res.data.next_question);
        setWaitCorrectAnswer(true);
        setSubtitle(res.data.feedback);
        await playTTS(res.data.feedback);
      } else {
        setSessionFinished(true);
        setFinalFeedback(res.data.feedback_summary || res.data.feedback);
        setSubtitle("모든 질문이 완료되었습니다!");
        await playTTS("모든 질문이 완료되었습니다!");
      }
    } catch {
      setSubtitle("❌ 서버 오류, 다시 시도!");
    }
    setIsLoading(false);
  };

  // 마이크 버튼 핸들러
  const handleMicClick = () => {
    if (isListening) stopRecording();
    else startRecording();
  };

  // 대화 종료(피드백 페이지 이동 등)
  const endSession = useCallback(async () => {
    const diary_date = new Date().toISOString().split("T")[0];
    const category = "retrospect";
    try {
      await postRetrospectDiary(diary_date, category, retrospectResults);
    } catch (e) {
      console.error("회상 QnA 저장 실패", e);
    }

    navigate("/retrospectdetail", {
      state: {
        feedback: finalFeedback,
        results: retrospectResults,
        questions,
      },
    });
  }, [navigate, finalFeedback, retrospectResults, questions]);

  useEffect(() => {
    if (subtitle === "모든 질문이 완료되었습니다!" && sessionFinished) {
      const timer = setTimeout(() => {
        endSession();
      }, 1200); // TTS가 끝날 수 있도록 1.2초 정도 딜레이
      return () => clearTimeout(timer);
    }
  }, [subtitle, sessionFinished, endSession]);

  return {
    audioRef,
    subtitle,
    isListening,
    isLoading,
    sessionStarted,
    sessionFinished,
    startSession,
    handleMicClick,
    endSession,
    hint,
    waitCorrectAnswer, // UI에서 "정답 STT"용 마이크 표시 등 활용
    retrospectResults,
  };
};
