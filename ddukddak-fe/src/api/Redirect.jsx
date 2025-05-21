import { useEffect } from "react";

export function KakaoRedirect() {
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) {
      console.error("코드가 없습니다.");
      return;
    }

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    fetch("http://localhost:8000/api/oauth/login", {
      method: "POST",
      headers: headers,
      body: new URLSearchParams({
        code: code,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.result) {
          console.log(data.result.user_id);
          console.log(data.result.jwt);
        } else {
          console.error("결과 데이터 없음", data);
        }
      })
      .catch((error) => {
        console.error("오류 발생", error);
      });
  }, []);

  return (
    <div>
      <h1>로그인 중입니다.</h1>
    </div>
  );
}

export default KakaoRedirect;
