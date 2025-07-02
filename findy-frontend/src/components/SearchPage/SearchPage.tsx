import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import NewsListContainer from '../NewsCard/NewsListContainer';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSidebar } from '../../contexts/SidebarContext';
import './SearchPage.css';
import 'react-datepicker/dist/react-datepicker.css';

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
  headlineScore?: number; // 제목 점수
  contentScore?: number;  // 내용 점수
}

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isNewsExpanded, setIsNewsExpanded] = useState(false); // 뉴스 확장 상태 추가
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'latest' | 'oldest' | 'title' | 'content' | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [originalKeyword, setOriginalKeyword] = useState('');
  const [convertedKeyword, setConvertedKeyword] = useState('');
  const [aiSummary, setAiSummary] = useState<string>(''); // ai 상태변수 추가
  const [isAiExpanded, setIsAiExpanded] = useState(false); // AI 답변 펼침 상태
  const { refreshSidebar } = useSidebar();

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const source = searchParams.get('source') || '';

  // 주요 언론사 목록 (표시용 한글명)
  const newsSources = [
    '조선일보', '중앙일보', '동아일보',
    '경향신문', '한겨레', '이데일리',
    '연합뉴스', '한국경제'
  ];

  // 한글 언론사명을 영어 코드로 변환하는 매핑
  const sourceCodeMap: { [key: string]: string } = {
    '조선일보': 'chosun',
    '중앙일보': 'joongang', 
    '동아일보': 'donga',
    '한국일보': 'hankook',
    '경향신문': 'khan',
    '한겨레': 'hani',
    '이데일리': 'edaily',
    '연합뉴스': 'yna',
    '한국경제': 'hankyung'
  };

  // 영어 코드를 한글명으로 변환하는 역매핑
  const reverseSourceCodeMap: { [key: string]: string } = {
    'chosun': '조선일보',
    'joongang': '중앙일보',
    'donga': '동아일보', 
    'hankook': '한국일보',
    'khan': '경향신문',
    'hani': '한겨레',
    'edaily': '이데일리',
    'yna': '연합뉴스',
    'hankyung': '한국경제'
  };

  // 뉴스 확장 상태가 변경될 때 사이드바 숨김/표시 처리
  useEffect(() => {
    const leftSidebarContainer = document.querySelector('.left-sidebar-container') as HTMLElement;
    const rightSidebarContainer = document.querySelector('.right-sidebar-container') as HTMLElement;
    
    if (isNewsExpanded) {
      // 확장 시 사이드바 숨김
      if (leftSidebarContainer) leftSidebarContainer.style.display = 'none';
      if (rightSidebarContainer) rightSidebarContainer.style.display = 'none';
    } else {
      // 축소 시 사이드바 표시
      if (leftSidebarContainer) leftSidebarContainer.style.display = 'block';
      if (rightSidebarContainer) rightSidebarContainer.style.display = 'block';
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (leftSidebarContainer) leftSidebarContainer.style.display = '';
      if (rightSidebarContainer) rightSidebarContainer.style.display = '';
    };
  }, [isNewsExpanded]);

  // 검색어나 카테고리가 변경되면 페이지를 0으로 초기화
  useEffect(() => {
    setCurrentPage(0);
  }, [query, category, source]);

  // 쿼리 / 카테고리 / 소스 바뀌었을 때 첫 검색 수행
  useEffect(() => {
    performSearch();
  }, [query, category, source]);

  // 페이지 이동 시 검색 수행
  useEffect(() => {
    if (currentPage === 0) return; // 이미 0페이지에서 검색한 경우 중복 막기
    performSearch();
  }, [currentPage]);

     // 여기서 검색어 받아서 뭐로 할지 적음
   const performSearch = async (researchMode: boolean = false) => {
     if (!query && !category && !source) return; // 파라미터가 없으면 검색하지 않음
     
     try {
       setIsLoading(true);
      
           const params = new URLSearchParams();
     if (query) params.append('q', query);
     if (category) params.append('category', category);
     // source 파라미터는 백엔드에서 인식하지 못하므로 제거하고 프론트엔드에서 필터링
       params.append('page', currentPage.toString());
       if (source) params.append('source', source); // 🔧 이 줄 추가
       // params.append('size', source ? '3000' : '10'); // 언론사 필터링 시 더 많은 데이터 요청 3000개 읽어오는건 에바참치임 안쓸 로직임
       params.append('size', '10'); // 항상 고정된 페이지 사이즈로, 10개만 뽑아옴. 백엔드에서 처리해서 보낸댜
     if (researchMode) {
       params.append('research', 'true');
     }

     // 통합된 검색 엔드포인트 사용
     const url = `https://localhost:8485/api/search?${params.toString()}`;
      
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data: any = await response.json();
        console.log('API 응답 데이터:', data);

        // 입력키워드와 실제 검색 키워드 가져옴
        setOriginalKeyword(data.originalKeyword || '');
        setConvertedKeyword(data.convertedKeyword || '');

        //백엔드에서 가져온 응답을 여기에 때려넣음
        setAiSummary(data.aiSummary || '');
        
        // API 응답 데이터를 NewsArticle 형태로 변환
        if (data.content && data.content.length > 0) {
                     let transformedNews = data.content.map((item: any) => ({
             id: item.id || item.url || Math.random().toString(),
             category: item.category || "기타",
             // category: categoryMap[item.category] || item.category, // 영어 카테고리를 한글로 변환
             headline: item.headline || "제목 없음",
             content: item.content || "내용 없음",
             // summary: item.summary || item.content?.substring(0, 100) + '...',
             preview: item.content?.substring(0, 100) + '...',
             time: item.time || "날짜 없음",
             source: item.source || '기타',
             tags: item.tags || [],
             url: item.url || "#",
             img: item.img || null, // MongoDB의 img 필드 추가
             keywords: item.keywords || [], // keywords 필드도 추가
             headlineScore: item.headlineScore || 0,  // 제목 점수
             contentScore: item.contentScore || 0     // 내용 점수
           }));

           
           // 클라이언트 사이드에서 언론사 필터링
           if (source) {
             // console.log('🔍 언론사 필터링 시작');
             // console.log('선택된 source:', source);
             //
             // // 필터링 전 데이터 확인
             // console.log('필터링 전 뉴스 개수:', transformedNews.length);
             // console.log('필터링 전 언론사들:', Array.from(new Set(transformedNews.map((article: NewsArticle) => article.source))));
             //
             // transformedNews = transformedNews.filter((article: NewsArticle) => {
             //   // 실제 데이터에서는 source 필드가 영어 코드로 저장되어 있음
             //   // 예: 'hankyung', 'donga', 'khan', 'hani' 등
             //   const matches = article.source === source;
             //
             //   if (matches) {
             //     console.log(`✅ 매칭됨: ${article.source} === ${source}`);
             //   }
             //   return matches;
             // });
             //
             // console.log('필터링 후 뉴스 개수:', transformedNews.length);
             //
             // // 언론사 필터링 시 페이지네이션 재계산
             // const itemsPerPage = 10;
             // const startIndex = currentPage * itemsPerPage;
             // const endIndex = startIndex + itemsPerPage;
             // const paginatedNews = transformedNews.slice(startIndex, endIndex);
             //
             // setSearchResults(paginatedNews);
             // setTotalResults(transformedNews.length);
             // setTotalPages(Math.ceil(transformedNews.length / itemsPerPage));
           } else {
             // 일반 검색 결과
             setSearchResults(transformedNews);
             setTotalResults(data.totalElements || 0);
             setTotalPages(data.totalPages || 0);
           }
          // 기사 점수 리스트 뽑아보기
          // console.log('정렬 대상 기사 리스트:', searchResults);
          // 기사 점수 목록 넣기
          // searchResults.forEach(article => {
          //   console.log(`기사 제목: ${article.headline}, \n제목 점수: ${article.headlineScore}, \n내용 점수: ${article.contentScore}`);
          // });
          setTotalResults(data.totalElements || 0);
          setTotalPages(data.totalPages || 0);
          setSearchResults(transformedNews);
          // setTotalResults(transformedNews.length);
          // setTotalPages(Math.ceil(transformedNews.length / 10));
        }

        else {
          setSearchResults([]);
          setTotalResults(0);
          setTotalPages(0);
        }
      } else {
        console.error('API 응답 오류:', response.status, response.statusText);
        throw new Error(`검색 실패: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('검색 오류:', error);
      
      // 백엔드 연결 실패 시 로그만 출력
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
      // 검색 실패 시 빈 결과 표시 (더미 데이터 사용하지 않음)
      setSearchResults([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReSearch = () => {
    performSearch(true); // researchMode: true
  };

  const handleNewsClick = async (article: NewsArticle) => {
    if (article.url && article.url !== '#') {
      // 클릭시 백엔드에 요청
      try {
        await fetch("https://localhost:8485/api/news/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: article.url,
            keywords: article.keywords
          })
        });
        console.log("클릭한 뉴스 키워드:", article.keywords);
        
        // 클릭 후 사이드바 새로고침
        setTimeout(() => {
          refreshSidebar();
        }, 500);
        
      } catch (err) {
        console.error("뉴스 클릭 기록 실패:", err);
      }
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSourceClick = (selectedSource: string) => {
    // 한글 언론사명을 영어 코드로 변환
    const sourceCode = sourceCodeMap[selectedSource] || selectedSource;
    let searchUrl = `/search?source=${encodeURIComponent(sourceCode)}`;
    if (query) {
      searchUrl += `&q=${encodeURIComponent(query)}`;
    }
    if (category) {
      searchUrl += `&category=${encodeURIComponent(category)}`;
    }
    navigate(searchUrl);
    // 페이지 상단으로 부드럽게 스크롤
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getSearchTitle = () => {
    if (source && query) {
      // 영어 코드를 한글명으로 변환하여 표시
      const sourceName = reverseSourceCodeMap[source] || source;
      return `"${query}" (${sourceName})`;
    } else if (source) {
      // 영어 코드를 한글명으로 변환하여 표시
      const sourceName = reverseSourceCodeMap[source] || source;
      return `${sourceName}`;
    } else if (query && category) {
      return `"${query}" (${category})`;
    } else if (query) {
      return `"${query}"`;
    } else if (category) {
      return `${category}`;
    }
    return '검색 결과';
  };

  // 뉴스 확장 상태 변경 핸들러
  const handleNewsExpandedChange = (isExpanded: boolean) => {
    setIsNewsExpanded(isExpanded);
  };

  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    
    // 종료 날짜가 선택되면 검색 실행
    if (start && end) {
      setShowDatePicker(false);
      // 날짜 필터 선택 시 다른 필터 해제
      setSelectedFilter(null);
      // 날짜 필터링과 함께 검색 재실행
      setCurrentPage(0);
    }
  };

  // 날짜 필터 초기화
  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(0);
  };

  // 날짜 선택기 토글 핸들러
  const handleDatePickerToggle = () => {
    if (!showDatePicker) {
      // 날짜 선택기를 열 때 다른 필터 해제
      setSelectedFilter(null);
    }
    setShowDatePicker(!showDatePicker);
  };

  // 필터 변경 핸들러 (하나만 선택 가능)
  const handleFilterChange = (filter: 'latest' | 'oldest' | 'title' | 'content') => {
    setSelectedFilter(prevFilter => prevFilter === filter ? null : filter);
    // 다른 필터 선택 시 날짜 필터 해제
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(0);
  };

  // AI 답변 토글 핸들러
  const handleAiToggle = () => {
    setIsAiExpanded(!isAiExpanded);
  };

  // AI 답변 미리보기 텍스트 생성 (200자로 제한)
  const getAiPreviewText = (text: string) => {
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  return (
    <div className={`search-page ${isNewsExpanded ? 'news-expanded' : ''}`}>
      <div className="search-content">
                 <div className="search-header">
           {/* 검색어 보여주기 - 헤더에서 검색했을 때만 표시 */}
           {query && (
             <>
               {convertedKeyword && originalKeyword !== convertedKeyword ? (
                 // 변환된 경우
                 <h1 className="search-request-title">
                   <strong>'{convertedKeyword}'</strong>로 검색한 결과입니다.{' '}
                   <strong className="re-search" onClick={handleReSearch}>'{originalKeyword}'</strong>로 검색하시겠습니까?
                 </h1>
               ) : (
                 // 변환되지 않았거나 동일한 경우
                 <h1 className="search-request-title">
                   <strong>'{originalKeyword}'</strong>로 검색한 결과입니다.
                 </h1>
               )}
             </>
           )}

          {/* 언론사별 검색 시에만 제목 표시 */}
          {source && (
            <h1 className="search-title">
              {getSearchTitle()} 기사
            </h1>
          )}
          
          {/* AI 답변 섹션 */}
          {query && (
              <div className="ai-answer-section">
                <div className="ai-answer-header">
                  <h3 className="ai-answer-title">🤖 AI 요약</h3>
                </div>
                <div className="ai-answer-content">
                  {aiSummary ? (
                    <div className="ai-answer-text">
                      <div className="ai-answer-body">
                        {isAiExpanded ? aiSummary : getAiPreviewText(aiSummary)}
                      </div>
                      
                      {aiSummary.length > 120 && (
                        <div className="ai-toggle-container">
                          <button 
                            className="ai-toggle-btn"
                            data-expanded={isAiExpanded}
                            onClick={handleAiToggle}
                          >
                            <span className="toggle-text">
                              {isAiExpanded ? '접기' : '더보기'}
                            </span>
                            <span className="ai-toggle-icon">
                              ▼
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : isLoading ? (
                    <div className="ai-answer-placeholder">
                      <p>AI가 뉴스를 분석하고 있습니다...</p>
                    </div>
                  ) : (
                    <div className="ai-answer-placeholder">
                      <p>"{query}"에 대한 AI 분석 결과가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
          )}




          {/* 언론사별 카테고리 버튼 */}
          {/* <div className="news-sources-section">
            <h3 className="sources-title">📰 언론사별 뉴스</h3>
            <div className="news-sources-grid">
              {newsSources.map((newsSource, index) => (
                <button
                  key={index}
                  className={`source-btn ${source === sourceCodeMap[newsSource] ? 'active' : ''}`}
                  onClick={() => handleSourceClick(newsSource)}
                >
                  {newsSource}
                </button>
              ))}
            </div>
          </div> */}
          <div className="news-sources-section">
            <div className="news-sources-grid">
                <button
                 className={`source-btn ${selectedFilter === 'latest' ? 'active' : ''}`}
                 onClick={() => handleFilterChange('latest')}
                 >
                  {t('search.filters.latest')}
                </button>
                <button
                 className={`source-btn ${selectedFilter === 'oldest' ? 'active' : ''}`}
                 onClick={() => handleFilterChange('oldest')}
                 >
                  {t('search.filters.oldest')}
                </button>
                <button
                 className={`source-btn ${selectedFilter === 'title' ? 'active' : ''}`}
                 onClick={() => handleFilterChange('title')}
                  >
                  {t('search.filters.title')}
                </button>
                <button
                 className={`source-btn ${selectedFilter === 'content' ? 'active' : ''}`}
                 onClick={() => handleFilterChange('content')}
                 >
                  {t('search.filters.content')}
                </button>
                <div className="date-picker-container">
                  <button
                    className={`source-btn ${startDate && endDate ? 'active' : ''}`}
                    onClick={handleDatePickerToggle}
                  >
                    {startDate && endDate 
                      ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                      : t('search.filters.period')
                    }
                  </button>
                  {showDatePicker && (
                    <div className="date-picker-dropdown">
                      <DatePicker
                        selected={startDate}
                        onChange={handleDateRangeChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        dateFormat="yyyy/MM/dd"
                        placeholderText="날짜 범위 선택"
                      />
                                             <div className="date-picker-actions">
                         <button 
                           className="date-reset-btn"
                           onClick={handleDateReset}
                         >
                           {t('search.filters.reset')}
                         </button>
                         <button 
                           className="date-close-btn"
                           onClick={() => setShowDatePicker(false)}
                         >
                           {t('search.filters.close')}
                         </button>
                       </div>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {searchResults.length === 0 ? (
              <div className="no-results">
                <h3>{t('search.noResults')}</h3>
                <p>{t('search.tryOther')}</p>
              </div>
            ) : (
              <div className="search-results">
                <div className="results-list">
                  <NewsListContainer
                    articles={[...searchResults].sort((a, b) => {
                      // 최신순 정렬
                      if (selectedFilter === 'latest') {
                        return new Date(b.time).getTime() - new Date(a.time).getTime();
                      // 오래된순 정렬
                      } else if (selectedFilter === 'oldest') {
                        return new Date(a.time).getTime() - new Date(b.time).getTime();
                      // 제목순 정렬
                      } else if (selectedFilter === 'title') {
                        console.log("제목 정렬 누름")
                        return (b.headlineScore || 0) - (a.headlineScore || 0);
                        // 내용순 정렬
                      } else if (selectedFilter === 'content') {
                        console.log("내용 정렬 누름")
                        return (b.contentScore || 0) - (a.contentScore || 0);
                      }
                      // 정렬 없음
                      return 0;
                    })}
                    onArticleClick={handleNewsClick}
                    onExpandedChange={handleNewsExpandedChange}
                  />
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="pagination">
                    {/* 맨 첫 페이지 버튼 */}
                    <button
                      className="pagination-btn first-last-btn"
                      disabled={currentPage === 0}
                      onClick={() => handlePageChange(0)}
                      title={t('search.firstPage')}
                    >
                      ≪
                    </button>
                    
                    <button
                      className="pagination-btn"
                      disabled={currentPage === 0}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      {t('search.previous')}
                    </button>
                    
                    <div className="pagination-numbers">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // 현재 페이지를 중심으로 앞뒤로 2페이지씩 표시
                        const startPage = Math.max(0, currentPage - 2);
                        const page = startPage + i;
                        
                        // 전체 페이지 수를 넘어가면 표시하지 않음
                        if (page >= totalPages) return null;
                        
                        return (
                          <button
                            key={page}
                            className={`pagination-number ${
                              page === currentPage ? 'active' : ''
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page + 1}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      className="pagination-btn"
                      disabled={currentPage === totalPages - 1}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      {t('search.next')}
                    </button>
                    
                    {/* 맨 마지막 페이지 버튼 */}
                    <button
                      className="pagination-btn first-last-btn"
                      disabled={currentPage === totalPages - 1}
                      onClick={() => handlePageChange(totalPages - 1)}
                      title={t('search.lastPage')}
                    >
                      ≫
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 