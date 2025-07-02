import React, { useEffect } from 'react';
import './TermsOfService.css';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    // 페이지 로드 시 스크롤을 상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1 className="terms-title">Findy 검색엔진 이용약관</h1>
        <p className="terms-date">최종 수정일: 2025년 6월 5일</p>

        <section className="terms-section">
          <h2 className="terms-section-title">제1조 (목적)</h2>
          <p>이 약관은 "Findy" 검색엔진(이하 "서비스")의 이용과 관련하여 이용자와 Findy 운영팀(이하 "운영자") 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-section-title">제2조 (정의)</h2>
          <p>"이용자"란 본 약관에 따라 Findy가 제공하는 서비스를 이용하는 자를 말합니다.</p>
          <p>"콘텐츠"란 이용자가 검색하거나 서비스 내에 표시되는 모든 텍스트, 이미지, 링크, 기사 등의 정보를 의미합니다.</p>
          <p>"운영자"란 서비스의 기술적, 법적, 정책적 운영을 담당하는 자를 말합니다.</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-section-title">제3조 (약관의 효력 및 변경)</h2>
          <p>본 약관은 서비스를 통해 온라인으로 게시되며, 이용자가 동의함으로써 효력을 발생합니다.</p>
          <p>운영자는 필요 시 약관을 개정할 수 있으며, 변경된 약관은 서비스 내 공지 또는 이메일을 통해 고지됩니다.</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-section-title">제4조 (서비스의 제공)</h2>
          <p>Findy는 뉴스, 블로그, 문서 등 인터넷상의 다양한 콘텐츠를 수집 및 색인하여 검색 결과로 제공합니다.</p>
          <p>운영자는 서비스의 일부 또는 전부를 운영상의 이유로 수정, 중단할 수 있습니다.</p>
          <p>Findy는 검색 결과의 정확성, 신뢰도, 최신성을 보장하지 않으며, 이용자의 주관적 판단에 따라 정보를 이용해야 합니다.</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-section-title">제5조 (이용자의 의무)</h2>
          <p>이용자는 관련 법령, 본 약관, 서비스 이용 안내 및 공지사항을 준수하여야 합니다.</p>
          <p>다음 행위를 금합니다:</p>
          <ul className="terms-list">
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>자동화 도구를 이용한 비정상적 접근</li>
            <li>타인의 정보를 무단으로 수집, 저장 또는 유포하는 행위</li>
            <li>서비스를 상업적 목적으로 무단 이용하는 행위</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="terms-section-title">제6조 (개인정보 보호)</h2>
          <p>Findy는 검색만을 위한 서비스이며, 개인정보를 수집하지 않습니다.</p>
          <p>단, 특정 기능(예: 즐겨찾기, 맞춤 검색 등)이 구현될 경우, 관련된 최소한의 정보를 수집하며, 이 경우 별도의 개인정보처리방침을 마련합니다.</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-section-title">제7조 (지적재산권)</h2>
          <p>Findy는 자체적으로 콘텐츠를 생산하지 않으며, 검색 결과는 원 콘텐츠 제공처의 지적재산권에 귀속됩니다.</p>
          <p>이용자는 검색 결과를 단순 열람 또는 비상업적 목적 외에는 사용할 수 없습니다.</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-section-title">제8조 (면책조항)</h2>
          <p>운영자는 검색 결과의 정확성, 적법성, 신뢰성 등에 대해 책임을 지지 않습니다.</p>
          <p>운영자는 이용자의 서비스 이용으로 인해 발생한 직접적·간접적 손해에 대해 책임을 지지 않습니다.</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-section-title">제9조 (서비스 중단)</h2>
          <p>천재지변, 시스템 장애, 보안 문제 등 부득이한 사유가 발생한 경우, 운영자는 사전 고지 없이 서비스를 일시적으로 중단할 수 있습니다.</p>
          <p>이로 인해 발생한 손해에 대하여 운영자는 책임을 지지 않습니다.</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-section-title">제10조 (준거법 및 재판관할)</h2>
          <p>본 약관은 대한민국 법령에 따라 해석되며,</p>
          <p>서비스 이용과 관련하여 분쟁이 발생할 경우, 운영자의 본사 소재지를 관할하는 법원을 제1심의 관할 법원으로 합니다.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService; 