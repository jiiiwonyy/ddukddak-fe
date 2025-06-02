export async function sttRequest(audioBlob) {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");

  const response = await fetch("https://nabiya.site/stt", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `STT 서버 오류 (${response.status})`);
  }

  const data = await response.json();
  if (!data.transcript) {
    throw new Error("음성 인식 결과가 없습니다.");
  }
  return data.transcript;
}
