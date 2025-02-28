import { http } from "msw";

export const handlers = [
  // 로그인 API Mock
  http.post("/api/login", async () => {
    return new Response(
      JSON.stringify({
        token: "mock-token-123",
        user: { id: 1, name: "희민" },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),

  // 유저 정보 가져오기
  http.get("/api/user", async () => {
    return new Response(
      JSON.stringify({ id: 1, name: "희민", email: "test@example.com" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),

  // 게시물 리스트
  http.get("/api/posts", async () => {
    return new Response(
      JSON.stringify([
        { id: 1, title: "첫 번째 게시물", content: "안녕하세요!" },
        { id: 2, title: "두 번째 게시물", content: "반갑습니다!" },
      ]),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),
];
