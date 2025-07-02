import React, { useEffect } from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    // 페이지 로드 시 스크롤을 상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <h1 className="privacy-title">Findy 개인정보처리방침</h1>
        <p className="privacy-date">최종 수정일: 2025년 6월 5일</p>

        <section className="privacy-section">
          <p>Findy(이하 "서비스")는 이용자의 개인정보를 소중히 여기며, 아래와 같이 개인정보처리방침을 수립·공개합니다. 이 방침은 관련 법령 및 정부의 지침을 준수하며, 이용자의 개인정보 보호를 최우선으로 합니다.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">제1조 (개인정보의 수집 항목 및 방법)</h2>
          <p>Findy는 원칙적으로 이용자의 개인정보를 수집하지 않습니다.</p>
          <p>Findy는 단순 검색엔진 서비스로, 별도의 로그인, 회원가입, 쿠키 저장, 위치 추적 등을 하지 않으며, 검색어 또는 결과에 대한 로그도 식별 가능 정보와 연결하지 않습니다.</p>
          <p className="privacy-note">🧪 단, 향후 맞춤형 기능(예: 즐겨찾기, 검색 히스토리 제공 등)이 도입되는 경우, 최소한의 개인정보를 수집할 수 있으며 이 경우 별도의 수집 항목 및 이용 목적을 명확히 고지합니다.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">제2조 (개인정보의 이용 목적)</h2>
          <p>현재 Findy는 개인정보를 수집하거나 이용하지 않으며, 향후 기능 확대 시 다음과 같은 목적 범위 내에서 이용할 수 있습니다:</p>
          <ul className="privacy-list">
            <li>검색 히스토리 기반의 개인 맞춤 추천 제공</li>
            <li>즐겨찾기/저장 기능 제공</li>
            <li>고객 문의에 대한 응대</li>
            <li>서비스 품질 개선을 위한 내부 분석</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">제3조 (개인정보의 보유 및 파기)</h2>
          <p>Findy는 현재 개인정보를 저장하지 않으므로, 별도의 보유 또는 파기 절차가 없습니다.</p>
          <p>향후 개인정보 수집이 발생할 경우, 수집 목적 달성 시 지체 없이 안전하게 파기할 것을 약속드립니다.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">제4조 (개인정보의 제3자 제공)</h2>
          <p>Findy는 이용자의 개인정보를 외부에 제공하지 않습니다.</p>
          <p>단, 법령에 따라 요구되는 경우 또는 이용자의 별도 동의가 있을 경우에 한해 제공할 수 있습니다.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">제5조 (개인정보의 보호조치)</h2>
          <p>Findy는 개인정보를 수집하지 않지만, 서비스 운영 과정에서 수집 가능한 비식별 로그(예: 방문 시간, 브라우저 종류 등)에 대해서는 다음과 같은 보호조치를 취합니다:</p>
          <ul className="privacy-list">
            <li>최소한의 로그 보존, 익명화 처리</li>
            <li>서버 접근 통제 및 암호화 설정</li>
            <li>정기적인 보안 점검 및 업데이트</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">제6조 (이용자의 권리)</h2>
          <p>Findy는 개인정보를 수집하지 않기 때문에 별도의 정보 열람, 정정, 삭제, 처리정지 등의 권리가 현재는 적용되지 않습니다. 다만, 추후 수집 시 관련 법령에 따라 이용자의 권리를 충실히 보장할 예정입니다.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">제7조 (개인정보 보호책임자 및 문의)</h2>
          <p>Findy는 개인정보 보호에 관한 업무를 총괄하는 책임자를 지정하고 있으며, 관련 문의사항은 아래 연락처로 보내주시면 성실히 답변드리겠습니다.</p>
          <div className="privacy-contact">
            <p><strong>책임자:</strong> 백경음 (운영자)</p>
            <p><strong>이메일:</strong> qorrudgma@naver.com</p>
            <p><strong>문의 가능 시간:</strong> 월요일 1 : 13 ~ 6 : 45 (공휴일 제외)</p>
          </div>
        </section>

        <section className="privacy-section note-section">
          <p>🧠 본 개인정보처리방침은 Findy의 서비스 기능에 따라 향후 변경될 수 있으며, 변경 시 서비스 내 공지를 통해 고지합니다.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 