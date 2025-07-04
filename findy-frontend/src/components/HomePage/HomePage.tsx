import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSidebar } from '../../contexts/SidebarContext';
import NewsCard from '../NewsCard/NewsCard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './HomePage.css';

// 뉴스 데이터 타입 정의
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
  img?: string;
  imageUrl?: string;
}

const HomePage: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]); // 화면에 표시할 뉴스 목록
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [popularSearches, setPopularSearches] = useState<string[]>([]); // 추후 인기 검색어 기능
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { refreshSidebar } = useSidebar();

  // 언론사 한글명 → 영어코드 매핑 객체
  const sourceCodeMap: { [key: string]: string } = {
    '조선일보': 'chosun',
    '중앙일보': 'joongang',
    '동아일보': 'donga',
    '한국일보': 'hankook',
    '경향신문': 'khan',
    '한겨레': 'hani',
    '이데일리': 'edaily',
    '연합뉴스': 'yna'
  };

  // 컴포넌트 마운트 시 뉴스 로드
  useEffect(() => {
    loadLatestNews();
  }, []);

  // 최신 뉴스 10건 로드
  const loadLatestNews = async () => {
    try {
      setIsLoading(true);

      // 백엔드에 size=10으로 요청 → 최신 뉴스 10건
      const response = await fetch("http://localhost:8485/api/search?page=0&size=10");
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const rawData = await response.json();
      const content = Array.isArray(rawData.content) ? rawData.content : [];

      // 응답 데이터를 NewsArticle 형태로 매핑
      const newsList: NewsArticle[] = content.map((item: any) => ({
        id: item.id || item.url || crypto.randomUUID(),
        category: item.category || "기타",
        headline: item.headline || "제목 없음",
        content: item.content || "내용 없음",
        preview: item.content?.substring(0, 100) + "...",
        time: item.time || "날짜 없음",
        source: item.source || "기타",
        tags: item.tags || [],
        url: item.url || "#",
        img: item.img || null,
        keywords: item.keywords || []
      }));

      setNewsData(newsList);
    } catch (error) {
      console.error("뉴스 로드 오류:", error);
      setNewsData([]); // 실패 시 빈 리스트
    } finally {
      setIsLoading(false);
    }
  };

  // 뉴스 클릭 시 동작: 클릭 기록 전송 + 새 창 열기
  const handleNewsClick = async (article: NewsArticle) => {
    if (article.url && article.url !== '#') {
      try {
        await fetch("http://localhost:8485/api/news/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: article.url,
            keywords: article.keywords
          })
        });

        // 클릭 후 사이드바 새로고침
        setTimeout(() => refreshSidebar(), 500);
      } catch (err) {
        console.error("뉴스 클릭 기록 실패:", err);
      }

      // 새 탭으로 뉴스 열기
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  // 언론사 버튼 클릭 시 해당 언론사로 검색 이동
  const handleSourceClick = (source: string) => {
    const sourceCode = sourceCodeMap[source] || source;
    navigate(`/search?source=${encodeURIComponent(sourceCode)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 로딩 중일 때 스피너 표시
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
      <main className="home-page">
        <div className="main-content">
          <div className="content-header">
            <h2 className="content-title">{t('home.latestNews')}</h2>
            <p className="content-subtitle">{t('home.subtitle')}</p>
          </div>

          <div className="news-wrapper">
            {newsData.length === 0 ? (
                <div className="no-results">
                  <h3>{t('home.noNews')}</h3>
                  <p>{t('home.tryLater')}</p>
                </div>
            ) : (
                <>
                  {/* 상단: 메인 뉴스카드 + 사이드 뉴스카드 */}
                  <div className="top-news-layout">
                    {newsData[0] && (
                        <NewsCard article={newsData[0]} cardType="main-large" onClick={handleNewsClick} />
                    )}

                    <div className="side-news-container">
                      {newsData.slice(1, 7).map((article) => (
                          <NewsCard
                              key={article.id || article.headline}
                              article={article}
                              cardType="side-small"
                              onClick={handleNewsClick}
                          />
                      ))}
                    </div>
                  </div>

                  {/* 하단 뉴스 4개 */}
                  {newsData.length > 7 && (
                      <div className="bottom-news-section">
                        <h3 className="bottom-news-title">{t('home.moreNews')}</h3>
                        <div className="bottom-news-grid">
                          {newsData.slice(7, 11).map((article) => (
                              <NewsCard
                                  key={article.id || article.headline}
                                  article={article}
                                  cardType="normal"
                                  onClick={handleNewsClick}
                              />
                          ))}
                        </div>
                      </div>
                  )}
                </>
            )}
          </div>
        </div>
      </main>
  );
};

export default HomePage;