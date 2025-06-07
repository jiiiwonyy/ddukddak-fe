import { useRef } from "react";
import dailyInstance from "./dailyInstance";

export function useTTS() {
  const audioRef = useRef(null);
  const playTTS = async (text) => {
    try {
      console.log("TTS 요청 시작:", text);
      const response = await dailyInstance.post("/tts", { text });

      console.log("TTS 응답 상태:", response.status);
      const data = response.data;
      console.log("TTS 응답 데이터:", data);

      if (!data.audio_url) {
        throw new Error("오디오 URL이 없습니다.");
      }

      const audioUrl = data.audio_url.startsWith("http")
        ? data.audio_url
        : `https://nabiya.site${data.audio_url}`;

      // 🎯 CORS 문제 회피를 위해 fetch + blob 사용
      const audioBlobResponse = await fetch(audioUrl, { mode: "cors" });
      if (!audioBlobResponse.ok) throw new Error("오디오 파일 가져오기 실패");

      const audioBlob = await audioBlobResponse.blob();
      const blobUrl = URL.createObjectURL(audioBlob);

      if (!audioRef.current) {
        console.error("audioRef가 없습니다");
        return;
      }

      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = blobUrl;
      audioRef.current.style.display = "block";

      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(
          () => reject(new Error("오디오 로드 타임아웃")),
          10000
        );

        audioRef.current.oncanplaythrough = () => {
          clearTimeout(timeoutId);
          resolve();
        };
        audioRef.current.onerror = (e) => {
          clearTimeout(timeoutId);
          console.error("오디오 로드 에러:", e);
          reject(new Error("오디오 로드 실패"));
        };

        audioRef.current.load();
      });

      console.log("오디오 재생 시작");
      await audioRef.current.play();
      console.log("오디오 재생 완료");

      // 🎯 URL 해제 (메모리 누수 방지)
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("TTS 오류:", error);
      throw error;
    }
  };

  return { audioRef, playTTS };
}
