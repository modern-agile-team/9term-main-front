import { worker } from "./browser";

// 브라우저 환경에서만 MSW를 시작하도록 수정
if (typeof window !== "undefined") {
  worker.start({
    onUnhandledRequest: "bypass", // 처리되지 않은 요청은 무시
  });
}
