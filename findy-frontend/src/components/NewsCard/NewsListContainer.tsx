import React, { useState, useEffect, useRef } from 'react';
import ExpandableNewsCard from './ExpandableNewsCard';
import './NewsListContainer.css';

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
  imageUrl?: string;
  img?: string;
  headlineScore?: number; // 제목 점수
  contentScore?: number;  // 내용 점수
}

interface NewsListContainerProps {
  articles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
  onExpandedChange?: (isExpanded: boolean) => void;
}

const NewsListContainer: React.FC<NewsListContainerProps> = ({ articles, onArticleClick, onExpandedChange }) => {
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleToggle = (articleId: string) => {
    const newExpandedId = expandedArticleId === articleId ? null : articleId;
    setExpandedArticleId(newExpandedId);
    
    // 토글 시 news-sources-grid까지 스크롤 이동
    if (newExpandedId !== null) {
      setTimeout(() => {
        const newsSourcesGrid = document.querySelector('.news-sources-grid');
        if (newsSourcesGrid) {
          const rect = newsSourcesGrid.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = rect.top + scrollTop - 80; // 헤더 높이 고려하여 100px 여유 공간
          
          window.scrollTo({ 
            top: Math.max(0, targetPosition), 
            behavior: 'smooth' 
          });
        }
      }, 100); // DOM 업데이트 후 스크롤
    }
    
    if (onExpandedChange) {
      onExpandedChange(newExpandedId !== null);
    }
  };

  useEffect(() => {
    if (onExpandedChange) {
      onExpandedChange(expandedArticleId !== null);
    }
  }, [expandedArticleId, onExpandedChange]);

  // 오른쪽 콘텐츠 높이에 맞춰 왼쪽 사이드바 높이 조정
  useEffect(() => {
    const adjustSidebarHeight = () => {
      if (expandedContentRef.current && sidebarRef.current && expandedArticleId) {
        const expandedHeight = expandedContentRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        
        // 확장된 콘텐츠가 뷰포트보다 높으면 뷰포트 높이로, 아니면 콘텐츠 높이로 설정
        const targetHeight = Math.max(expandedHeight, viewportHeight);
        sidebarRef.current.style.height = `${targetHeight}px`;
      } else if (sidebarRef.current && !expandedArticleId) {
        // 확장된 콘텐츠가 없으면 기본 높이로 복원
        sidebarRef.current.style.height = 'auto';
      }
    };

    // 초기 조정
    adjustSidebarHeight();

    // ResizeObserver로 콘텐츠 크기 변화 감지
    let resizeObserver: ResizeObserver | null = null;
    if (expandedContentRef.current) {
      resizeObserver = new ResizeObserver(adjustSidebarHeight);
      resizeObserver.observe(expandedContentRef.current);
    }

    // 윈도우 리사이즈 이벤트 리스너
    window.addEventListener('resize', adjustSidebarHeight);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', adjustSidebarHeight);
    };
  }, [expandedArticleId]);

  const expandedArticle = expandedArticleId 
    ? articles.find(article => (article.id || `article-${articles.indexOf(article)}`) === expandedArticleId)
    : null;

  return (
    <div className={`news-list-container ${expandedArticleId ? 'has-expanded' : ''}`}>
      {/* 왼쪽 리스트 영역 */}
      <div className="news-list-sidebar" ref={sidebarRef}>
        {articles.map((article, index) => {
          // id가 없는 경우 인덱스를 사용
          const articleId = article.id || `article-${index}`;
          
          return (
            <ExpandableNewsCard
              key={articleId}
              article={{ ...article, id: articleId }}
              onClick={onArticleClick}
              isExpanded={false} // 리스트에서는 항상 축소된 형태로 표시
              onToggle={handleToggle}
            />
          );
        })}
      </div>

      {/* 오른쪽 확장된 콘텐츠 영역 */}
      {expandedArticle && (
        <div className="expanded-news-content" ref={expandedContentRef}>
          <ExpandableNewsCard
            article={expandedArticle}
            onClick={onArticleClick}
            isExpanded={true}
            onToggle={handleToggle}
          />
        </div>
      )}
    </div>
  );
};

export default NewsListContainer; 