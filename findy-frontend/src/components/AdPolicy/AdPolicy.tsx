import React, { useEffect } from 'react';
import './AdPolicy.css';

const AdPolicy: React.FC = () => {
  useEffect(() => {
    // 페이지 로드 시 스크롤을 상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="ad-policy-container">
      <div className="ad-policy-content">
        <h1 className="ad-policy-title">Findy 광고 정책</h1>
        <p className="ad-policy-date">최종 수정일: 2025년 6월 5일</p>

        <section className="ad-policy-section">
          <p>Findy(이하 "서비스")는 사용자에게 유익한 검색 결과를 제공함과 동시에, 건전하고 신뢰할 수 있는 광고 환경을 조성하기 위해 다음과 같은 광고 정책을 시행합니다.</p>
        </section>

        <section className="ad-policy-section">
          <h2 className="ad-policy-section-title">제1조 (광고의 목적 및 원칙)</h2>
          <p>Findy는 광고를 통해 서비스 운영에 필요한 재원을 마련하며, 이용자에게 무료로 서비스를 제공합니다.</p>
          <p>광고는 서비스의 품질을 해치지 않도록 신중하게 선별하며, 아래 원칙을 준수합니다:</p>
          
          <ul className="ad-policy-list">
            <li><strong>투명성:</strong> 광고는 검색 결과 또는 콘텐츠와 명확히 구분되며, "광고", "스폰서" 등의 표기를 통해 이용자가 광고임을 인지할 수 있도록 합니다.</li>
            <li><strong>관련성:</strong> 이용자의 관심사와 검색 의도에 부합하는 광고만을 노출하도록 노력합니다.</li>
            <li><strong>신뢰성:</strong> 허위·과장 광고, 혐오·불법·불건전 콘텐츠는 절대 허용하지 않습니다.</li>
          </ul>
        </section>

        <section className="ad-policy-section">
          <h2 className="ad-policy-section-title">제2조 (광고 유형)</h2>
          <p>Findy는 다음과 같은 형태의 광고를 운영할 수 있습니다:</p>
          
          <h3 className="ad-policy-subsection-title">검색 결과 상단 광고 (Sponsored Links)</h3>
          <p>특정 키워드 검색 시, 검색결과 상단 또는 하단에 노출되는 광고입니다.</p>
          
          <h3 className="ad-policy-subsection-title">배너 광고 / 디스플레이 광고</h3>
          <p>웹사이트 내 일부 영역(예: 사이드바, 푸터)에 삽입되는 이미지형 광고입니다.</p>
          
          <h3 className="ad-policy-subsection-title">맞춤형 광고 (추후 도입 예정)</h3>
          <p>이용자의 검색 히스토리, 관심 주제 등을 기반으로 자동 추천되는 개인화 광고입니다.</p>
          <p>이 기능 도입 시 별도의 동의 절차와 개인정보 활용 고지를 진행합니다.</p>
        </section>

        <section className="ad-policy-section">
          <h2 className="ad-policy-section-title">제3조 (허용되지 않는 광고)</h2>
          <p>다음에 해당하는 광고는 게재가 제한되며, 위반 시 즉시 차단 조치됩니다.</p>
          <ul className="ad-policy-list">
            <li>성인용, 음란물, 도박, 마약 등 법률 위반 콘텐츠</li>
            <li>허위·과장된 표현을 통해 오해를 유도하는 광고</li>
            <li>불쾌감, 공포, 폭력성 등을 유발하는 콘텐츠</li>
            <li>악성코드, 피싱 사이트 등 보안 위험을 유발하는 광고</li>
            <li>사회적 혐오, 차별, 편견을 조장하는 광고</li>
          </ul>
        </section>

        <section className="ad-policy-section">
          <h2 className="ad-policy-section-title">제4조 (광고 게재의 책임과 면책)</h2>
          <p>광고 콘텐츠의 정확성, 적법성, 효용성에 대한 책임은 광고주에게 있으며, Findy는 단순 매개자로서 책임을 지지 않습니다.</p>
          <p>광고를 통해 연결된 외부 사이트의 서비스, 상품 구매, 거래 행위에 대해 Findy는 개입하지 않으며, 모든 거래는 이용자와 광고주 간의 계약에 따라 진행됩니다.</p>
        </section>

        <section className="ad-policy-section">
          <h2 className="ad-policy-section-title">제5조 (이용자의 선택권)</h2>
          <p>이용자는 광고 영역을 식별할 수 있으며, 광고를 클릭하지 않아도 서비스를 자유롭게 이용할 수 있습니다.</p>
          <p>추후 맞춤형 광고가 도입될 경우, 이용자는 이를 수신 거부(opt-out) 또는 광고 설정 조정을 통해 통제할 수 있습니다.</p>
        </section>

        <section className="ad-policy-section">
          <h2 className="ad-policy-section-title">제6조 (정책 변경 안내)</h2>
          <p>광고 정책은 법령, 광고 생태계, 서비스 운영의 변화에 따라 수정될 수 있으며, 변경 시 서비스 내 공지사항 또는 별도 알림을 통해 고지됩니다.</p>
        </section>

        <section className="ad-policy-section note-section">
          <p>🧠 Findy는 사용자 중심의 검색엔진으로서, 정보 탐색의 자유와 광고의 투명성이라는 두 마리 토끼를 모두 추구합니다. 광고도 콘텐츠처럼, 신뢰를 얻는 것이 목표입니다. 진짜 "좋은 광고"가 뭔지, 우리가 함께 정의해보자구요! 😎</p>
        </section>
      </div>
    </div>
  );
};

export default AdPolicy; 