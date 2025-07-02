import React from 'react';
import './NewsCard.css';

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
  img?: string; // MongoDB에서 사용하는 이미지 필드 추가
  headlineScore?: number; // 제목 점수
  contentScore?: number;  // 내용 점수
}

interface NewsCardProps {
  article: NewsArticle;
  cardType: 'main-primary' | 'main-secondary' | 'side' | 'normal' | 'list' | 'main-large' | 'side-small';
  onClick: (article: NewsArticle) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, cardType, onClick }) => {
  const handleClick = () => {
    onClick(article);
  };

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
    // 언론사별 아이콘 매핑 (API에서 받는 source 코드에 맞춤)
    const sourceIcons: { [key: string]: string } = {
      // API source 코드로 매핑
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
      
      // 한글명으로도 매핑 (호환성)
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
      
      // 기본 아이콘
      'default': '/images/sources/default-news.svg'
    };
    
    return sourceIcons[source] || sourceIcons['default'];
  };

  // 언론사 이름 변환 함수 (영문 코드 -> 한글명)
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

  const getCardClassName = () => {
    switch (cardType) {
      case 'main-primary':
      case 'main-secondary':
      case 'main-large':
        return 'main-news-card';
      case 'side':
      case 'side-small':
        return 'side-news-card';
      case 'normal':
        return 'news-card';
      case 'list':
        return 'list-news-card';
      default:
        return 'news-card';
    }
  };
// 메인뉴스 카드
  const renderMainCard = (isPrimary: boolean) => (
    <div className={getCardClassName()} onClick={handleClick}>
      <div className="news-card-header">
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
      
      {/* 메인 뉴스 이미지 */}
      {(article.img || article.imageUrl) && (
        <div className="main-news-image-container">
          <img 
            src={article.img || article.imageUrl} 
            alt={article.headline}
            className="main-news-image"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <h3 className="main-news-title">{article.headline}</h3>
      <p className="main-news-preview">{article.preview}</p>
      <div className="news-card-footer">
        <span className="news-date">{formatDate(article.time)}</span>
      </div>
    </div>
  );
// 사이드 뉴스카드
  const renderSideCard = () => (
    <div className={getCardClassName()} onClick={handleClick}>
      <div className="news-card-header">
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
      <h4 className="side-news-title">{article.headline}</h4>
      <p className="side-news-preview">{article.preview}</p>
      <div className="news-card-footer">
        <span className="news-date">{formatDate(article.time)}</span>
      </div>
    </div>
  );
// 사이드 작은 뉴스카드 
  const renderSideSmallCard = () => (
    <div className={getCardClassName()} onClick={handleClick}>
      <div className="news-card-header">
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
      <h4 className="side-news-title">{article.headline}</h4>
    </div>
  );
// 일반 뉴스카드        
  const renderNormalCard = () => (
    <div className={getCardClassName()} onClick={handleClick}>
      <div className="news-card-header">
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
      <h4 className="news-title">{article.headline}</h4>
      <p className="news-preview">{article.preview}</p>
      <div className="news-card-footer">
        <span className="news-date">{formatDate(article.time)}</span>
      </div>
    </div>
  );
// 검색창 뉴스카드
  const renderListCard = () => (
    <div className={getCardClassName()} onClick={handleClick}>
      <div className="list-news-content">
        <div className="list-news-main">
          <div className="news-card-header">
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
          <h3 className="list-news-title">{article.headline}</h3>
          <p className="list-news-preview">{article.preview}</p>
          {/* <p className="list-news-preview">{article.content}</p> */}
        </div>
        <div className="news-card-footer">
          <span className="news-date">{formatDate(article.time)}</span>
        </div>
      </div>
    </div>
  );

  switch (cardType) {
    case 'main-primary':
      return renderMainCard(true);
    case 'main-secondary':
      return renderMainCard(false);
    case 'main-large':
      return renderMainCard(true);
    case 'side':
      return renderSideCard();
    case 'side-small':
      return renderSideSmallCard();
    case 'normal':
      return renderNormalCard();
    case 'list':
      return renderListCard();
    default:
      return renderNormalCard();
  }
};

export default NewsCard; 