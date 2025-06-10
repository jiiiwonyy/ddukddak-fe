import { useState, useEffect, useRef } from "react";
import { useTTS } from "../api/useTTS";
import { sttRequest } from "../api/useSTT"; // Assuming this is the correct import path
import dailyInstance from "./dailyInstance";
import { useNavigate } from "react-router-dom";

export const useDiaryChat = (startFunction, category) => {
  const { audioRef, playTTS } = useTTS();
  const [chatMessage, setChatMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 스트림 종료
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const playTTSWithFlag = async (text) => {
    setIsTTSPlaying(true);
    try {
      await playTTS(text);
    } finally {
      setIsTTSPlaying(false);
    }
  };

  const startConversation = async () => {
    setIsLoading(true);
    try {
      const response = await startFunction();
      const message =
        typeof response.data === "string"
          ? response.data
          : response.data.response ||
            response.data.message ||
            "응답이 없습니다.";

      setChatMessage(message);
      setIsLoading(false); // 🔥 응답 오자마자 해제!
      try {
        await playTTSWithFlag(message);
      } catch {
        console.error("TTS 오류:", message);
      }
    } catch {
      const errorMessage = "메시지를 불러오는데 실패했습니다.";
      setChatMessage(errorMessage);
      setIsLoading(false); // 🔥 에러도 바로 해제!
      try {
        await playTTSWithFlag(errorMessage);
      } catch {
        console.error("TTS 오류:", errorMessage);
      }
    }
  };

  const startRecording = async () => {
    if (isProcessing || isTTSPlaying) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm;codecs=opus",
          });
          await processAudio(audioBlob);
        } finally {
          stream.getTracks().forEach((track) => track.stop());
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch {
      const errorMessage = "음성 녹음을 시작할 수 없습니다.";
      setChatMessage(errorMessage);
      try {
        await playTTSWithFlag(errorMessage);
      } catch {
        console.error("TTS 오류:", errorMessage);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      const transcript = await sttRequest(audioBlob);
      if (!transcript || !transcript.trim()) {
        setChatMessage("음성 인식 결과가 비어있습니다.");
        return;
      }
      await sendMessage(transcript);
    } catch {
      const errorMessage = "음성 인식에 실패했습니다. 다시 시도해주세요.";
      setChatMessage(errorMessage);
      try {
        await playTTSWithFlag(errorMessage);
      } catch {
        console.error("TTS 오류:", errorMessage);
      }
    }
  };

  const sendMessage = async (message) => {
    if (!message || !message.trim()) return;

    try {
      const response = await dailyInstance.post("/ask", { message });
      setChatCount((c) => c + 1);
      if (response.status !== 200) {
        throw new Error(
          `메시지 전송 서버 오류 (${response.status}): ${response.statusText}`
        );
      }

      const data = response.data;

      if (data.diary) {
        // 2초(2000ms) 후에 이동
        setTimeout(() => {
          navigate("/modifydiary", {
            state: { diary: data.diary, category },
          });
        }, 2000);
        return data.diary;
      }

      if (!data.response) throw new Error("봇 응답이 없습니다.");

      // 자막 즉시 업데이트
      setChatMessage(data.response);

      // 음성 재생은 비동기로 처리
      playTTSWithFlag(data.response).catch((err) =>
        console.error("TTS 재생 오류:", err)
      );
    } catch (err) {
      console.error(err);
      const errorMessage =
        "메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.";

      // 에러 메시지 자막 표시
      setChatMessage(errorMessage);

      // 에러 메시지 음성 재생
      playTTSWithFlag(errorMessage).catch((err) =>
        console.error("TTS 재생 오류:", err)
      );
    }
  };

  const endDiary = async () => {
    await sendMessage("그만 할래"); // 서버가 종료 메시지로 인식할 수 있는 문장!
  };

  return {
    audioRef,
    chatMessage,
    isListening,
    isProcessing,
    isLoading,
    isTTSPlaying,
    chatCount,
    handleMicClick: () => {
      if (isListening) stopRecording();
      else startRecording();
    },
    startConversation,
    endDiary,
    sendMessage,
  };
};
