import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faTimes, faExpand } from '@fortawesome/free-solid-svg-icons';
import { useSidebar } from '../../contexts/SidebarContext';
import './ExpandableNewsCard.css';

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

interface ExpandableNewsCardProps {
  article: NewsArticle;
  onClick: (article: NewsArticle) => void;
  isExpanded?: boolean;
  onToggle?: (articleId: string) => void;
}

const ExpandableNewsCard: React.FC<ExpandableNewsCardProps> = ({ 
  article, 
  onClick, 
  isExpanded = false,
  onToggle 
}) => {
  const { refreshSidebar } = useSidebar();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 언론사 아이콘 URL 생성 함수
  const getSourceIcon = (source: string) => {
    const sourceIcons: { [key: string]: string } = {
      'yna': '/images/sources/yonhap.png',
      'kbs': '/images/sources/kbs.jpg',
      'mbc': '/images/sources/mbc.png',
      'sbs': '/images/sources/sbs.png',
      'jtbc': '/images/sources/jtbc.svg',
      'chosun': '/images/sources/chosun.png',
      'joongang': '/images/sources/joongang.svg',
      'donga': '/images/sources/donga.png',
      'hani': '/images/sources/hani.svg',
      'khan': '/images/sources/khan.jpg',
      'edaily': '/images/sources/edaily.png',
      'hankyung': '/images/sources/hankyung.png',
      '연합뉴스': '/images/sources/yonhap.png',
      'KBS': '/images/sources/kbs.jpg',
      'MBC': '/images/sources/mbc.png',
      'SBS': '/images/sources/sbs.png',
      'JTBC': '/images/sources/jtbc.svg',
      '조선일보': '/images/sources/chosun.png',
      '중앙일보': '/images/sources/joongang.svg',
      '동아일보': '/images/sources/donga.png',
      '한겨레': '/images/sources/hani.svg',
      '경향신문': '/images/sources/khan.jpg',
      '이데일리': '/images/sources/edaily.png',
      '한국경제': '/images/sources/hankyung.png',
      'default': '/images/sources/default-news.svg'
    };
    
    return sourceIcons[source] || sourceIcons['default'];
  };

  // 언론사 이름 변환 함수
  const getSourceName = (source: string) => {
    const sourceNames: { [key: string]: string } = {
      'yna': '연합뉴스',
      'kbs': 'KBS',
      'mbc': 'MBC', 
      'sbs': 'SBS',
      'jtbc': 'JTBC',
      'chosun': '조선일보',
      'joongang': '중앙일보',
      'donga': '동아일보',
      'hani': '한겨레',
      'khan': '경향신문',
      'edaily': '이데일리',
      'hankyung': '한국경제'
    };
    
    return sourceNames[source] || source;
  };

  const handleToggle = async  (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggle && article.id) {
      onToggle(article.id);
      // 클릭시 백엔드에 요청
      try {
        await fetch("http://localhost:8485/api/news/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: article.url,
            keywords: article.keywords
          })
        });
        console.log("클릭한 뉴스 => ", article.url);
        console.log("클릭한 키워드 => ", article.keywords);
        
        // 클릭 후 사이드바 새로고침
        setTimeout(() => {
          refreshSidebar();
        }, 500);
      } catch (err) {
        console.error("뉴스 클릭 기록 실패:", err);
      }
    }
  };

  const handleCardClick = () => {
    if (!isExpanded) {
      onClick(article);
    }
  };

  // 확장된 상태일 때는 다른 레이아웃으로 렌더링
  if (isExpanded) {
    return (
      <div className="expanded-content-direct">
        <div className="expanded-header">
          <h2 className="expanded-title">{article.headline}</h2>
          <button 
            className="close-btn"
            onClick={handleToggle}
            aria-label="닫기"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        {/* 이미지가 있다면 표시 */}
        {(article.img || article.imageUrl) && (
          <div className="expanded-image-container">
            <img 
              src={article.img || article.imageUrl} 
              alt={article.headline}
              className="expanded-image"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="expanded-meta">
          <div className="expanded-source">
            <img 
              src={getSourceIcon(article.source || 'default')} 
              alt={getSourceName(article.source || 'default')} 
              className="expanded-source-icon"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/sources/default-news.svg';
              }}
            />
            <span className="expanded-source-name">{getSourceName(article.source || 'default')}</span>
          </div>
          <span className="expanded-category">{article.category}</span>
          <span className="expanded-date">{formatDate(article.time)}</span>
        </div>
        
        <div className="expanded-content-text">
          <div className="expanded-full-content">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="content-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        {/* 키워드 태그 */}
        {/* {article.keywords && article.keywords.length > 0 && (
          <div className="expanded-keywords">
            <h4 className="keywords-title">관련 키워드</h4>
            <div className="keywords-list">
              {article.keywords.map((keyword, index) => (
                <span key={index} className="keyword-tag">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )} */}
        
        {/* 원문 링크 */}
        <div className="expanded-actions">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="original-link-btn"
          >
            원문 보기
          </a>
        </div>
      </div>
    );
  }

  // 축소된 상태일 때는 기존 레이아웃
  return (
    <div className="expandable-news-card" onClick={handleCardClick}>
      <div className="expandable-card-layout">
        {/* 왼쪽 이미지 영역 */}
        {(article.img || article.imageUrl) && (
          <div className="expandable-card-image">
            <img 
              src={article.img || article.imageUrl} 
              alt={article.headline}
              className="expandable-news-image"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* 오른쪽 콘텐츠 영역 */}
        <div className="list-news-content">
          <div className="list-news-main">
            <div className="expandable-card-header">
              <div className="news-source">
                <img 
                  src={getSourceIcon(article.source || 'default')} 
                  alt={getSourceName(article.source || 'default')} 
                  className="source-icon"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/sources/default-news.svg';
                  }}
                />
                <span className="source-name">{getSourceName(article.source || 'default')}</span>
              </div>
              <span className="news-category-badge">{article.category}</span>
            </div>
            
            <h3 className="list-news-title">
              {article.headline}
            </h3>
            
            <p className="list-news-preview">{article.preview}</p>
          </div>
          
          <div className="expandable-card-footer">
            <span className="news-date">{formatDate(article.time)}</span>
          </div>
          
          {/* 토글 버튼을 별도 줄에 중앙 배치 */}
          <div className="toggle-button-container">
            <button 
              className="toggle-btn"
              onClick={handleToggle}
              aria-label={isExpanded ? "닫기" : "펼치기"}
            >
              <FontAwesomeIcon icon={faExpand} />
              <span className="toggle-text">자세히</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandableNewsCard; 