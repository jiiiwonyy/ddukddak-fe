import { useRef } from "react";

export function useTTS() {
  const audioRef = useRef(null);

  const playTTS = async (text) => {
    try {
      console.log("TTS 요청 시작:", text);
      const response = await fetch("https://nabiya.site/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ text }),
        mode: "cors",
        cache: "no-cache",
        referrerPolicy: "no-referrer",
      });

      console.log("TTS 응답 상태:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("TTS 서버 응답 에러:", errorText);
        throw new Error(`TTS 서버 오류 (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log("TTS 응답 데이터:", data);

      if (!data.audio_url) {
        throw new Error("오디오 URL이 없습니다.");
      }

      const audioUrl = data.audio_url.startsWith("http")
        ? data.audio_url
        : `https://nabiya.site/static/${data.audio_url}`;

      console.log("오디오 URL:", audioUrl);

      if (!audioRef.current) {
        console.error("audioRef가 없습니다");
        return;
      }

      // 오디오 로드 전에 이전 오디오 정리
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // 새로운 오디오 설정
      audioRef.current.src = audioUrl;
      audioRef.current.style.display = "block";

      console.log("오디오 로드 시작");
      try {
        await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error("오디오 로드 타임아웃"));
          }, 10000); // 10초 타임아웃

          audioRef.current.oncanplaythrough = () => {
            clearTimeout(timeoutId);
            resolve();
          };

          audioRef.current.onerror = (e) => {
            clearTimeout(timeoutId);
            console.error("오디오 로드 에러:", e);
            reject(
              new Error(
                `오디오 로드 실패: ${
                  e.target.error?.message || "알 수 없는 에러"
                }`
              )
            );
          };

          audioRef.current.load();
        });

        console.log("오디오 재생 시작");
        await audioRef.current.play();
        console.log("오디오 재생 완료");
      } catch (audioError) {
        console.error("오디오 처리 중 에러:", audioError);
        throw audioError;
      }
    } catch (err) {
      console.error("TTS 처리 중 에러 발생:", err);
      // 에러를 상위로 전파하지 않고 조용히 처리
      return;
    }
  };

  return { audioRef, playTTS };
}
