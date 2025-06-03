import dailyInstance from "./dailyInstance";

export async function sttRequest(audioBlob) {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");

    const response = await dailyInstance.post("/stt", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data;
    if (!data.transcript) {
      throw new Error("음성 인식 결과가 없습니다.");
    }
    return data.transcript;
  } catch (error) {
    console.error("STT 오류:", error);
    throw error;
  }
}
