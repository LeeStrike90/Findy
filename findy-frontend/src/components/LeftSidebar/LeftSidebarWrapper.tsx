import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSidebar } from '../../contexts/SidebarContext';
import './LeftSidebar.css';

interface NewsArticle {
  id?: string;
  headline: string;
  content: string;
  preview: string;
  keywords: string[];
  category: string;
  time: string;
  source: string;
  url: string;
  img?: string; // MongoDB의 이미지 필드
  imageUrl?: string; // 기존 호환성을 위한 필드
}

/**
 * 왼쪽 사이드바 Wrapper 컴포넌트
 * - SidebarProvider로 감싸서 Context 제공
 * - 실시간 인기기사 표시
 * - 스크롤에 따른 위치 조정 (90% 스크롤 시 고정)
 * - 언론사명 한글 매핑 기능
 */
const LeftSidebarWrapper: React.FC = () => {
  const [popularArticles, setPopularArticles] = useState<NewsArticle[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldStopAtFooter, setShouldStopAtFooter] = useState(false); // 스크롤 위치에 따른 사이드바 고정 상태
  const [isMobile, setIsMobile] = useState(false); // 모바일 환경 감지
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setRefreshFunction } = useSidebar();

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

    loadPopularContent();
    
    // 새로고침 함수를 Context에 등록
    setRefreshFunction(loadPopularArticles);

    // 스크롤에 따른 사이드바 위치 조정 로직 (90% 스크롤 시 고정)
    const handleScroll = () => {
      // 모바일에서는 스크롤 로직 실행하지 않음
      if (window.innerWidth <= 1024) return;
      
      const sidebar = document.querySelector('.left-sidebar-container') as HTMLElement;
      
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

    // 초기 실행 및 이벤트 리스너 등록
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [setRefreshFunction]);

  // 실시간 인기기사 로드 (언론사명 한글 매핑 포함)
  const loadPopularArticles = async () => {
    try {
      console.log("Top5 기사 로딩 시작...");
      setIsLoading(true);
      // Top5 기사 API 호출로 변경
      const response = await fetch("http://localhost:8485/api/news/top5");
      
      if (response.ok) {
        const rawData = await response.json();
        const rawContent = Array.isArray(rawData) ? rawData : [];
        console.log("Top5 기사 데이터:", rawContent.length + "개");
        
        // 영어 언론사명을 한글로 매핑하는 객체
        const sourceNameMap: { [key: string]: string } = {
          'chosun': '조선일보',
          'joongang': '중앙일보',
          'donga': '동아일보',
          'khan': '경향신문',
          'hani': '한겨레',
          'edaily': '이데일리',
          'yonhap': '연합뉴스',
          'yna': '연합뉴스',
          'sbs': 'SBS',
          'kbs': 'KBS',
          'mbc': 'MBC',
          'ytn': 'YTN',
          'seoul': '서울신문',
          'hankyung': '한국경제'
        };
        
        const mappedData: NewsArticle[] = rawContent.map((item: any) => ({
          id: item.id || item.url || Math.random().toString(),
          category: item.category || "기타",
          headline: item.headline || "제목 없음",
          content: item.content || "내용 없음",
          preview: item.content?.substring(0, 50) + '...',
          time: item.time || "날짜 없음",
          source: sourceNameMap[item.source] || item.source || '기타', // 영어 → 한글 매핑 적용
          tags: item.tags || [],
          url: item.url || "#",
          img: item.img || null, // MongoDB의 img 필드 추가
          keywords: item.keywords || [] // keywords 필드도 추가
        }));

        setPopularArticles(mappedData.slice(0, 5)); // 상위 5개 기사만 표시
        console.log("Top5 기사 업데이트 완료");
      } else {
        console.error("Top5 기사 로드 실패:", response.status);
      }
    } catch (error) {
      console.error('인기기사 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPopularContent = () => {
    loadPopularArticles();
    // loadPopularSearches(); // 사용하지 않으므로 제거
  };

  // 기사 클릭 시 새 탭에서 열기
  const handleArticleClick = async (article: NewsArticle) => {
    console.log("사이드바 기사 클릭됨:", article.headline);
    
    if (article.url && article.url !== '#') {
      // 새 탭에서 기사 열기 (사이드바 자체 클릭은 백엔드 요청하지 않음)
      window.open(article.url, '_blank', 'noopener,noreferrer');
    } else {
      console.log("URL이 유효하지 않음:", article.url);
    }
  };

  // 언론사 로고 URL 가져오기
  const getSourceLogo = (source: string): string => {
    // 한글 언론사명을 영어 코드로 변환하는 역매핑
    const sourceCodeMap: { [key: string]: string } = {
      '조선일보': 'chosun',
      '중앙일보': 'joongang',
      '동아일보': 'donga',
      '경향신문': 'khan',
      '한겨레': 'hani',
      '이데일리': 'edaily',
      '연합뉴스': 'yna',
      'SBS': 'sbs',
      'KBS': 'kbs',
      'MBC': 'mbc',
      'YTN': 'ytn',
      '서울신문': 'seoul',
      '한국경제': 'hankyung'
    };

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

    const sourceCode = sourceCodeMap[source] || source.toLowerCase();
    return logoMap[sourceCode] || `/images/sources/${sourceCode}.png`;
  };

  // 검색어 클릭 시 검색 페이지로 이동
  const handleSearchClick = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  // 모바일 환경에서는 사이드바를 렌더링하지 않음
  if (isMobile) {
    return null;
  }

  return (
    <div className={`left-sidebar-container ${shouldStopAtFooter ? 'stop-at-footer' : ''}`}>
      <div className="left-sidebar">
        {/* 실시간 인기기사 섹션 */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">{t('sidebar.popularArticles')}</h3>
          
          {isLoading ? (
            <div className="sidebar-loading">{t('sidebar.loading')}</div>
          ) : (
            <div className="popular-articles">
              {popularArticles.map((article, index) => (
                <div 
                  key={article.id || index}
                  className="popular-article-item"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="article-content">
                    <div className="article-headline">{article.headline}</div>
                    <div className="article-source-container">
                      <img 
                        src={getSourceLogo(article.source)} 
                        alt={article.source} 
                        className="source-logo"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/sources/default-news.svg';
                        }}
                      />
                      <span className="article-source">{article.source}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebarWrapper; 