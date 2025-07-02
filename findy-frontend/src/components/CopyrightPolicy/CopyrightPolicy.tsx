import React, { useEffect } from 'react';
import './CopyrightPolicy.css';

const CopyrightPolicy: React.FC = () => {
  useEffect(() => {
    // 페이지 로드 시 스크롤을 상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-container">
      <div className="policy-content">
        <h1 className="policy-title">Findy 저작권 정책</h1>
        <p className="policy-date">최종 수정일: 2025년 6월 5일</p>

        <section className="policy-section">
          <p>Findy(이하 "서비스")는 이용자에게 다양한 인터넷상의 콘텐츠를 색인·검색하여 제공하는 플랫폼이며, 본 서비스에 노출되는 모든 콘텐츠의 저작권 보호를 중요하게 생각합니다. 본 정책은 Findy가 콘텐츠를 어떻게 다루며, 저작권 관련 요청을 어떻게 처리하는지에 대해 안내합니다.</p>
        </section>

        <section className="policy-section">
          <h2 className="policy-section-title">제1조 (검색 결과의 콘텐츠 저작권)</h2>
          <p>Findy는 자체적으로 콘텐츠를 생산하거나 편집하지 않습니다.</p>
          <p>검색 결과로 노출되는 기사, 이미지, 링크, 요약문 등의 저작권은 해당 콘텐츠의 원저작자 또는 제공처에 귀속됩니다.</p>
          <p>Findy는 해당 콘텐츠에 대한 소유권을 주장하지 않으며, 콘텐츠의 무단 복제, 배포, 전송 등을 허용하지 않습니다.</p>
        </section>

        <section className="policy-section">
          <h2 className="policy-section-title">제2조 (저작권 침해에 대한 대응)</h2>
          <p>Findy는 저작권자의 권리를 존중하며, 다음의 절차에 따라 저작권 침해 신고를 접수하고 처리합니다:</p>
          
          <h3 className="policy-subsection-title">1. 신고 접수 방법</h3>
          <p>이메일: qorrudgma@naver.com</p>
          <p>필수 기재 내용:</p>
          <ul className="policy-list">
            <li>침해된 것으로 판단되는 콘텐츠의 URL</li>
            <li>저작권자의 이름 및 연락처</li>
            <li>저작권 보유 사실을 증명할 수 있는 자료 또는 링크</li>
            <li>침해 사실 설명 및 요청 사항</li>
          </ul>

          <h3 className="policy-subsection-title">2. 처리 절차</h3>
          <p>신고 내용이 명확한 경우, 즉시 해당 검색 결과의 노출을 중단하거나 조정합니다.</p>
          <p>불명확하거나 오해의 여지가 있는 경우, 추가 소명을 요청할 수 있습니다.</p>
        </section>

        <section className="policy-section">
          <h2 className="policy-section-title">제3조 (저작권자의 콘텐츠 차단 요청)</h2>
          <p>저작권자는 자신의 콘텐츠가 Findy 검색 결과에 노출되는 것을 원하지 않는 경우, 사전 차단 요청을 할 수 있으며, 다음과 같은 방법으로 신청할 수 있습니다:</p>
          <ul className="policy-list">
            <li>robots.txt 설정 (Disallow: /) 또는</li>
            <li>개별 URL/도메인 등록을 통한 색인 제외 요청</li>
          </ul>
          <p>※ 자동화된 검색 차단 기능을 사용하더라도 완전한 제거를 원할 경우, 별도 이메일 요청이 권장됩니다.</p>
        </section>

        <section className="policy-section">
          <h2 className="policy-section-title">제4조 (면책조항)</h2>
          <p>Findy는 검색 결과의 자동화된 색인 방식으로 인해, 실시간으로 저작권 여부를 개별 판단하지 않습니다.</p>
          <p>이용자의 검색 결과 이용 과정에서 발생하는 저작권 침해에 대해 Findy는 직접적인 법적 책임을 지지 않습니다.</p>
          <p>다만, 정당한 신고 접수 시 적극적으로 저작권 보호를 위한 조치를 취합니다.</p>
        </section>

        <section className="policy-section">
          <h2 className="policy-section-title">제5조 (정책의 변경 및 고지)</h2>
          <p>본 저작권 정책은 법령 또는 서비스 운영상 필요에 따라 변경될 수 있으며, 변경 시 서비스 화면 또는 별도의 공지사항을 통해 고지합니다.</p>
        </section>

        <section className="policy-section note-section">
          <p>✍️ Findy는 창작자의 권리를 존중하며, 건강한 디지털 생태계 조성을 위해 노력합니다.</p>
          <p>모든 저작권자는 당연히 보호받아야 하고, 이용자는 이를 지켜주는 멋진 검색 모험가가 되어야 합니다. 🧭</p>
        </section>
      </div>
    </div>
  );
};

export default CopyrightPolicy; 