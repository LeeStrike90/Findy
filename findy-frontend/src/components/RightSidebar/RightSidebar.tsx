import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import './RightSidebar.css';

interface NewsSource {
  name: string;
  code: string;
  category: string;
  description: string;
}
/**
 * 오른쪽 사이드바 컴포넌트
 * - 언론사 목록 표시 (로고 + 이름)
 * - 스크롤에 따른 위치 조정 (90% 스크롤 시 고정)
 * - 실제 이미지 파일 사용 및 에러 처리
 */
const RightSidebar: React.FC = () => {
  const [newsSources] = useState<NewsSource[]>([
    { name: '조선일보', code: 'chosun', category: '종합', description: '대한민국 대표 종합일간지' },
    { name: '중앙일보', code: 'joongang', category: '종합', description: '신뢰할 수 있는 뉴스와 정보' },
    { name: '동아일보', code: 'donga', category: '종합', description: '정론직필의 언론정신' },
    { name: '경향신문', code: 'khan', category: '종합', description: '진보적 시각의 종합일간지' },
    { name: '한겨레', code: 'hani', category: '종합', description: '민주언론의 새로운 지평' },
    { name: '한국경제', code: 'hankyung', category: '경제', description: '대한민국 대표 경제 신문' },
    { name: '이데일리', code: 'edaily', category: '경제', description: '경제전문 인터넷신문' },
    { name: '연합뉴스', code: 'yna', category: '통신', description: '대한민국 대표 뉴스통신사' },
  ]);
  
  const [shouldStopAtFooter, setShouldStopAtFooter] = useState(false);// 스크롤 위치에 따른 사이드바 고정 상태
  const [isMobile, setIsMobile] = useState(false); // 모바일 환경 감지
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // 모바일 환경 감지 함수
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 1024;
      setIsMobile(isMobileDevice);
      return isMobileDevice;
    };

    // 초기 모바일 체크
    if (checkMobile()) {
      return; // 모바일이면 나머지 로직 실행하지 않음
    }

    // 스크롤에 따른 사이드바 위치 조정 로직 (90% 스크롤 시 고정)
    const handleScroll = () => {
      // 모바일에서는 스크롤 로직 실행하지 않음
      if (window.innerWidth <= 1024) return;
      
      const sidebar = document.querySelector('.right-sidebar-container') as HTMLElement;
      
      if (sidebar) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const sidebarHeight = sidebar.offsetHeight;
        
        // 스크롤 진행률 계산 (0~1 사이 값)
        const scrollProgress = (scrollTop + windowHeight) / documentHeight;
        const shouldStop = scrollProgress >= 0.9; // 90% 스크롤 시 멈춤 (아래쪽 10% 남음)
        
        if (shouldStop) {
          // 스크롤 90% 지점에서 사이드바를 절대 위치로 고정
          const stopPosition = documentHeight * 0.9 - windowHeight / 2 - sidebarHeight / 2;
          setShouldStopAtFooter(true);
          sidebar.style.position = 'absolute';
          sidebar.style.top = `${Math.max(100, stopPosition)}px`;
          sidebar.style.transform = 'none';
        } else {
          // 일반 상태: 화면 중앙에 고정 (fixed positioning)
          setShouldStopAtFooter(false);
          sidebar.style.position = 'fixed';
          sidebar.style.top = '50%';
          sidebar.style.transform = 'translateY(-50%)';
        }
      }
    };

    // 리사이즈 핸들러 (모바일 감지 포함)
    const handleResize = () => {
      const isMobileNow = checkMobile();
      if (!isMobileNow) {
        handleScroll();
      }
    };

    // ✅ DOM 렌더링이 끝난 다음에 강제로 실행
    requestAnimationFrame(() => handleScroll());
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSourceClick = (source: NewsSource) => {
    console.log('🔘 RightSidebar - 언론사 버튼 클릭:', source.name, '코드:', source.code);
    console.log('🔘 네비게이트 URL:', `/search?source=${source.code}`);
    navigate(`/search?source=${source.code}`);
  };

  const getSourceLogo = (sourceCode: string) => {
    // 언론사별 로고 이미지 경로
    const logoMap: { [key: string]: string } = {
      'chosun': '/images/sources/chosun.png',
      'joongang': '/images/sources/joongang.svg',
      'donga': '/images/sources/donga.png',
      'khan': '/images/sources/khan.jpg',
      'hani': '/images/sources/hani.svg',
      'edaily': '/images/sources/edaily.png',
      'yna': '/images/sources/yonhap.png',
      'hankyung': '/images/sources/hankyung.png',
    };
    
    return logoMap[sourceCode] || '/images/sources/default-news.svg';
  };

  // 모바일 환경에서는 사이드바를 렌더링하지 않음
  if (isMobile) {
    return null;
  }

  return (
    <div className={`right-sidebar-container ${shouldStopAtFooter ? 'stop-at-footer' : ''}`}>
      <div className="right-sidebar">
        {/* 언론사 목록 섹션 */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">{t('sidebar.newsSources')}</h3>
          
          <div className="news-sources">
            <div className="news-sources-content">
              {newsSources.map((source) => (
                <button 
                  key={source.code}
                  className="source-btn-header"
                  onClick={() => handleSourceClick(source)}
                  title={source.description}
                >
                  <img 
                    src={getSourceLogo(source.code)} 
                    alt={source.name}
                    className="source-logo-img"
                    onError={(e) => {
                      e.currentTarget.src = '/images/sources/default-news.svg';
                    }}
                  />
                  <span className="source-name-header">{source.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar; 