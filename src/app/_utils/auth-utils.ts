// 구글 OAuth 인증 시작
// 백엔드의 구글 OAuth 엔드포인트로 리다이렉트
export const initiateGoogleOAuth = async (): Promise<void> => {
  const oauthUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  console.log('Google OAuth URL:', oauthUrl);
  window.location.href = oauthUrl;
};

export const initiateKakaoOAuth = async (): Promise<void> => {
  const oauthUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`;
  console.log('Kakao OAuth URL:', oauthUrl);
  window.location.href = oauthUrl;
};

