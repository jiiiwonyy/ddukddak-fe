import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { BsMic, BsMicFill } from "react-icons/bs";
import { startDailyDiary } from "../api/diary";
import { useTTS } from "../api/useTTS";
import { sttRequest } from "../api/useSTT";

const DailyDiary = () => {
  const { audioRef, playTTS } = useTTS();
  const [chatMessage, setChatMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      startConversation();
      isInitialized.current = true;
    }
    // 언마운트 시 정리
    return () => {
      if (mediaRecorderRef.current && isListening) {
        mediaRecorderRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startConversation = async () => {
    try {
      const response = await startDailyDiary();
      const message =
        typeof response.data === "string"
          ? response.data
          : response.data.response || response.data.message;
      setChatMessage(message);
      try {
        await playTTS(message);
      } catch {
        // ignore TTS error
      }
    } catch {
      setChatMessage("메시지를 불러오는데 실패했습니다.");
      try {
        await playTTS("메시지를 불러오는데 실패했습니다.");
      } catch {
        // ignore
      }
    }
  };

  // 마이크 버튼 토글
  const handleMicClick = async () => {
    if (isListening) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    if (isProcessing) return; // 처리 중이면 녹음 시작 금지
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new window.MediaRecorder(stream);
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
          // 스트림 정리
          stream.getTracks().forEach((track) => track.stop());
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch {
      setChatMessage("음성 녹음을 시작할 수 없습니다.");
      try {
        await playTTS("음성 녹음을 시작할 수 없습니다.");
      } catch {
        // ignore
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
        // ignore
      }
    }
  };

  const sendMessage = async (message) => {
    if (!message || !message.trim()) return;
    try {
      const response = await fetch("https://nabiya.site/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        mode: "cors",
      });
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch {
          // ignore
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
        // ignore TTS error
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        "메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setChatMessage(errorMessage);
      try {
        await playTTS(errorMessage);
      } catch {
        // ignore TTS error
      }
    }
  };

  return (
    <PageWrapper>
      <FixedBackground />
      <Title className="title1">일상일기</Title>
      <ContentWrapper>
        <CharacterImage src="/assets/images/dailyCat.svg" alt="Character" />
        <Subtitle>{chatMessage || "로딩 중..."}</Subtitle>
        <OuterCircle>
          <InnerCircle onClick={handleMicClick}>
            {isListening ? (
              <BsMicFill size={32} color="#fff" />
            ) : (
              <BsMic size={32} color="#fff" />
            )}
          </InnerCircle>
        </OuterCircle>
      </ContentWrapper>
      <audio ref={audioRef} style={{ display: "none" }} />
    </PageWrapper>
  );
};

export default DailyDiary;

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const FixedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("/assets/images/dailyBG.svg") no-repeat center center;
  background-size: cover;
  z-index: 0;
`;

const Title = styled.h1`
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  flex-direction: column;
  display: flex;
  z-index: 1;
  position: relative;
`;

const CharacterImage = styled.img`
  position: relative;
  top: 0%;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  height: auto;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  background: transparent;
  border-radius: 1rem;
  margin: 20px;
  padding: 20px;
  height: calc(100vh - 40px);
  overflow-y: hidden;
  overflow-x: hidden;
`;

const Subtitle = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  color: #212121;
  font-weight: bold;
  z-index: 2;
  margin-top: 100px;
`;

const OuterCircle = styled.div`
  width: 100px;
  height: 100px;
  background-color: #dceeff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  bottom: 20%;
`;
const InnerCircle = styled.div`
  width: 70px;
  height: 70px;
  background-color: #a9d1ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
