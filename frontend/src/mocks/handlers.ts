import { http } from "msw";
import { posts } from "./data/posts";
import { Post } from "@/types/Post";

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

  // 게시물 리스트 (커뮤니티 게시글로 변경)
  http.get("/api/posts", async ({ request }) => {
    console.log("MSW: 게시글 목록 요청 처리 중", request.url);
    const url = new URL(request.url);
    const tag = url.searchParams.get("tag");

    let filteredPosts = posts;

    // 태그로 필터링
    if (tag && tag !== "전체") {
      filteredPosts = posts.filter((post) => post.tags.includes(tag));
    }

    return new Response(JSON.stringify(filteredPosts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),

  // 특정 게시글 가져오기
  http.get("/api/posts/:id", async ({ params }) => {
    const { id } = params;
    const post = posts.find((p) => p.id === Number(id));

    if (!post) {
      return new Response(
        JSON.stringify({ message: "게시글을 찾을 수 없습니다." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),

  // 게시글 작성하기
  http.post("/api/posts", async ({ request }) => {
    const newPost = (await request.json()) as Partial<Post>;

    return new Response(
      JSON.stringify({
        ...newPost,
        id: posts.length + 1,
        authorRole: "방금 전",
        likes: 0,
        comments: 0,
        saved: false,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  }),

  // 게시글 좋아요 토글
  http.patch("/api/posts/:id/like", async ({ params }) => {
    const { id } = params;
    const post = posts.find((p) => p.id === Number(id));

    if (!post) {
      return new Response(
        JSON.stringify({ message: "게시글을 찾을 수 없습니다." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ liked: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),

  // 게시글 저장 토글
  http.patch("/api/posts/:id/save", async ({ params }) => {
    const { id } = params;
    const post = posts.find((p) => p.id === Number(id));

    if (!post) {
      return new Response(
        JSON.stringify({ message: "게시글을 찾을 수 없습니다." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ saved: !post.saved }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
];
