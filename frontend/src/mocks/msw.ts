import { worker } from "./browser";

// 브라우저 환경에서만 MSW를 시작하도록 수정
if (typeof window !== "undefined") {
  worker
    .start({
      onUnhandledRequest: "warn", // 처리되지 않은 요청은 경고로 표시
    })
    .catch((error) => {
      console.error("MSW 시작 중 오류 발생:", error);
    });

  console.log("MSW 핸들러:", worker.listHandlers());
}
