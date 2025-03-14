export default function LoginPage() {
  return (
    <div>
      <h1>로그인</h1>
      <form>
        <input type="email" placeholder="이메일" />
        <input type="password" placeholder="비밀번호" />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
