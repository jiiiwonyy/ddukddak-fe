import { useState, useEffect, useRef } from "react";
import { useTTS } from "../api/useTTS";
import { sttRequest } from "../api/useSTT"; // Assuming this is the correct import path

export const useDiaryChat = (startFunction) => {
  const { audioRef, playTTS } = useTTS();
  const [chatMessage, setChatMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const token = localStorage.getItem("access_token");

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
      try {
        await playTTS(message);
      } catch {
        console.error("TTS 오류:", message);
      }
    } catch {
      const errorMessage = "메시지를 불러오는데 실패했습니다.";
      setChatMessage(errorMessage);
      try {
        await playTTS(errorMessage);
      } catch {
        console.error("TTS 오류:", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    if (isProcessing) return;
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
        await playTTS(errorMessage);
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
        await playTTS(errorMessage);
      } catch {
        console.error("TTS 오류:", errorMessage);
      }
    }
  };

  const sendMessage = async (message) => {
    if (!message || !message.trim()) return;
    try {
      const response = await fetch("https://nabiya.site/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
        mode: "cors",
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch {
          console.error("응답 JSON 파싱 오류");
        }
        throw new Error(
          errorData.error || `메시지 전송 서버 오류 (${response.status})`
        );
      }

      const data = await response.json();
      if (!data.response) throw new Error("봇 응답이 없습니다.");

      setChatMessage(data.response);
      try {
        await playTTS(data.response);
      } catch {
        console.error("TTS 오류:", data.response);
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        "메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setChatMessage(errorMessage);
      try {
        await playTTS(errorMessage);
      } catch {
        console.error("TTS 오류:", errorMessage);
      }
    }
  };

  return {
    audioRef,
    chatMessage,
    isListening,
    isProcessing,
    isLoading,
    handleMicClick: () => {
      if (isListening) stopRecording();
      else startRecording();
    },
    startConversation,
  };
};
