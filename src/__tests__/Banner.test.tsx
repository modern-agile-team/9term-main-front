import { render, screen } from '@testing-library/react';
import Banner from '@/app/_components/Banner';

describe('Banner 컴포넌트', () => {
  it('배너가 올바르게 렌더링되어야 합니다', () => {
    render(<Banner />);

    // 배너 텍스트가 화면에 표시되는지 확인
    const bannerText = screen.getByText(
      '개발자 스터디 모임에 오신 것을 환영합니다'
    );
    expect(bannerText).toBeInTheDocument();
  });
});
