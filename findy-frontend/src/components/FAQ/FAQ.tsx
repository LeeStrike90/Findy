import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FAQ.css';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

type SearchType = '전체' | '제목' | '내용';

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category') || '전체';
  const pageParam = parseInt(queryParams.get('page') || '1');
  const searchTypeParam = queryParams.get('searchType') as SearchType || '전체';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>(searchTypeParam);
  const itemsPerPage = 10;

  useEffect(() => {
    // 페이지 로드 시 스크롤을 상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // URL 쿼리 파라미터 업데이트
    const params = new URLSearchParams();
    if (selectedCategory !== '전체') {
      params.append('category', selectedCategory);
    }
    if (currentPage !== 1) {
      params.append('page', currentPage.toString());
    }
    if (searchType !== '전체') {
      params.append('searchType', searchType);
    }
    navigate({
      pathname: '/faq',
      search: params.toString()
    }, { replace: true });
  }, [selectedCategory, currentPage, searchType, navigate]);

  // FAQ 데이터
  const faqData: FAQ[] = [
    {
      id: 1,
      category: '서비스 전반',
      question: 'Findy는 어떤 검색엔진인가요?',
      answer: 'Findy는 불필요한 광고와 잡음을 줄이고, 진짜 정보를 빠르게 찾을 수 있게 도와주는 텍스트 기반 검색엔진입니다. TF-IDF, 문맥 분석, 형태소 처리 등 직접 만든 알고리즘으로 동작하며, 가볍고 똑똑한 검색을 추구합니다.'
    },
    {
      id: 2,
      category: '서비스 전반',
      question: 'Google이나 Naver랑 뭐가 달라요?',
      answer: 'Findy는 광고보다 정보, 속도보다 정확성, 화려함보다 본질을 추구합니다. 또한 필터링이 덜한 중립적 결과, 신규·소외된 사이트까지 검색해내는 게 특징이에요.'
    },
    {
      id: 3,
      category: '서비스 전반',
      question: '어떤 사이트들이 색인돼 있나요?',
      answer: '현재는 뉴스, 블로그, 커뮤니티, 문서, 공공데이터 위주로 색인 중이며, 향후 사용자가 직접 색인 요청도 할 수 있게 준비 중입니다.'
    },
    {
      id: 4,
      category: '기능/사용 관련',
      question: '검색 결과가 이상하거나 너무 적어요.',
      answer: '이런 경우에는: 키워드를 더 일반적으로 바꿔보세요. 띄어쓰기와 맞춤법 확인! 아직 색인되지 않은 페이지일 수 있어요. 지속되면 qorrudgma@naver.com으로 알려주세요! 개발팀이 출동합니다 🚨'
    },
    {
      id: 5,
      category: '기능/사용 관련',
      question: '검색어 저장되나요? 추적 당하진 않나요?',
      answer: 'Findy는 개인 식별 가능한 로그를 저장하지 않습니다. IP 추적, 검색 기록 연결, 쿠키 기반 리타게팅 광고 등은 하지 않아요. 익명 검색이 철학입니다.'
    },
    {
      id: 6,
      category: '기능/사용 관련',
      question: '나만의 즐겨찾기 기능은 없나요?',
      answer: '현재는 없습니다만, 곧! 로그인 없이도 저장할 수 있는 로컬 기반 즐겨찾기, 또는 로그인 기반 저장 기능이 준비 중입니다.'
    },
    {
      id: 7,
      category: '광고/저작권 관련',
      question: '검색 결과에 광고도 나오나요?',
      answer: '네, 일부 키워드에는 광고가 포함될 수 있습니다. 하지만 항상 "광고" 또는 "스폰서"로 명시하며, 일반 검색과 절대 섞지 않습니다. 우리는 "헷갈리는 광고"는 철학적으로 거부합니다 🙅‍♀️'
    },
    {
      id: 8,
      category: '광고/저작권 관련',
      question: '내 콘텐츠가 Findy에 노출되는 걸 막고 싶어요.',
      answer: 'robots.txt에 Disallow: /를 설정해주시거나, qorrudgma@naver.com으로 URL과 이유를 보내주세요. 진심으로 콘텐츠 소유자의 권리를 존중합니다.'
    },
    {
      id: 9,
      category: '광고/저작권 관련',
      question: 'Findy는 수익을 어디서 얻나요?',
      answer: '주로 광고와 향후 유료 API/데이터 분석 서비스를 통해 운영될 예정입니다. 광고는 절대 사용자 경험을 해치지 않는 방식으로 제한합니다.'
    },
    {
      id: 10,
      category: '민감/기타 질문',
      question: '성인 콘텐츠도 검색되나요?',
      answer: 'Findy는 성인 콘텐츠를 색인하지 않으며, 관련 키워드 검색 시에도 차단 필터가 기본 적용됩니다. 다만 향후 성인 모드(성인 인증 후 사용) 여부는 사용자 피드백에 따라 고민 중입니다.'
    },
    {
      id: 11,
      category: '민감/기타 질문',
      question: '정치적 성향을 반영하나요?',
      answer: 'Findy는 정치적 중립을 최우선 가치로 삼습니다. 뉴스/블로그 결과는 원출처 그대로 제공되며, 특정 입장을 강화하거나 필터링하지 않습니다.'
    },
    {
      id: 12,
      category: '민감/기타 질문',
      question: '검색어 자동완성이 이상하거나 부적절해요.',
      answer: 'Findy의 자동완성은 과거 검색 빈도와 형태소 분석 기반으로 생성됩니다. 부적절하거나 불쾌한 자동완성이 있다면 즉시 qorrudgma@naver.com으로 알려주세요.'
    },
    {
      id: 13,
      category: '민감/기타 질문',
      question: '범죄에 관련된 내용도 검색돼요?',
      answer: 'Findy는 법령 위반 소지가 있는 콘텐츠를 의도적으로 유도하지 않습니다. 공공성과 보도 목적이 있는 정보는 노출될 수 있으며, 불법적 목적으로의 사용은 금지합니다.'
    },
    {
      id: 14,
      category: '민감/기타 질문',
      question: '검색어로 사람을 특정하거나 모욕할 수 있나요?',
      answer: '안 됩니다. Findy는 명예훼손, 모욕, 개인정보 침해 검색을 엄격히 제한합니다. 문제 되는 검색결과는 즉시 조치하며, 지속 신고 시 키워드 자체를 차단합니다.'
    },
    {
      id: 15,
      category: '민감/기타 질문',
      question: 'Findy는 종교·인종·성별 등 민감한 주제는 어떻게 다루나요?',
      answer: '혐오, 차별, 편견을 조장하는 검색 결과는 의도적으로 배제되며, 중립적·정보 중심의 결과만 제공하려 노력합니다.'
    },
    {
      id: 16,
      category: '개발자/기술 관련',
      question: 'API 제공하나요?',
      answer: '베타 API는 준비 중입니다. 검색 결과, 키워드 분석, 랭킹 제공 기능 등이 포함될 예정이며, 기술 제휴 또는 테스트를 원하시면 qorrudgma@naver.com으로 연락 주세요.'
    },
    {
      id: 17,
      category: '개발자/기술 관련',
      question: '오픈소스인가요?',
      answer: '검색엔진 자체는 클로즈드 소스지만, 일부 크롤러/전처리/랭킹 알고리즘은 향후 공개할 계획이 있습니다. GitHub에서 만나봐요!'
    },
    {
      id: 18,
      category: '개발자/기술 관련',
      question: '내가 만든 사이트도 Findy에 노출되나요?',
      answer: '네! 공개된 웹사이트라면 색인 대상입니다. 원하지 않을 경우 관리자 연락처 또는 qorrudgma@naver.com을 통해 알려주세요.'
    },
    {
      id: 19,
      category: '기타 질문',
      question: '모바일에서도 잘 작동하나요?',
      answer: '완전히요! 모바일 웹에 최적화되어 있으며, 추후 iOS/Android 앱도 출시 예정입니다.'
    },
    {
      id: 20,
      category: '기타 질문',
      question: '운영자는 누구인가요? 믿을 수 있나요?',
      answer: 'Findy는 국내 개발자 팀이 운영하며, 기술 독립성과 정보 윤리를 소중히 여깁니다. 이용자와의 신뢰를 바탕으로 성장하는 작지만 진지한 검색엔진입니다.'
    }
  ];

  // 카테고리 리스트 (중복 제거)
  const categories = ['전체', ...Array.from(new Set(faqData.map(faq => faq.category)))];

  // 검색 타입에 따른 필터링
  const filterBySearchType = (faq: FAQ) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    switch (searchType) {
      case '제목':
        return faq.question.toLowerCase().includes(query);
      case '내용':
        return faq.answer.toLowerCase().includes(query);
      case '전체':
      default:
        return faq.question.toLowerCase().includes(query) || 
               faq.answer.toLowerCase().includes(query);
    }
  };

  // 필터링된 FAQ 데이터
  const filteredFaqs = faqData.filter(faq => {
    const categoryMatch = selectedCategory === '전체' || faq.category === selectedCategory;
    const searchMatch = filterBySearchType(faq);
    return categoryMatch && searchMatch;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // 검색 타입 변경 핸들러
  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as SearchType);
  };

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // FAQ 항목 클릭 핸들러
  const handleFaqClick = (faqId: number) => {
    navigate(`/faq/detail/${faqId}`);
  };

  return (
    <div className="faq-container">
      <div className="faq-content">
        <h1 className="faq-title">Findy 자주 묻는 질문 (FAQ)</h1>

        {/* 검색 폼 */}
        <div className="faq-search-section">
          <form onSubmit={handleSearch} className="faq-search-form">
            <div className="search-type-container">
              <select 
                className="search-type-select"
                value={searchType}
                onChange={handleSearchTypeChange}
              >
                <option value="전체">전체</option>
                <option value="제목">제목</option>
                <option value="내용">내용</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="질문 검색하기..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="faq-search-input"
            />
            <button type="submit" className="faq-search-button">검색</button>
          </form>
        </div>

        {/* 카테고리 탭 */}
        <div className="faq-category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`faq-category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ 목록 */}
        <div className="faq-list">
          {currentItems.length > 0 ? (
            currentItems.map((faq) => (
              <div 
                key={faq.id} 
                className="faq-item"
                onClick={() => handleFaqClick(faq.id)}
              >
                <div className="faq-question">
                  <span className="faq-category-badge">{faq.category}</span>
                  <h3>{faq.question}</h3>
                  <div className="faq-arrow">›</div>
                </div>
              </div>
            ))
          ) : (
            <div className="faq-no-results">
              <p>검색 결과가 없습니다. 다른 검색어나 카테고리를 선택해 보세요.</p>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="faq-pagination">
            <button 
              className="pagination-button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              이전
            </button>
            
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              className="pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              다음
            </button>
          </div>
        )}

        {/* 추가 문의 안내 */}
        <div className="faq-more-questions">
          <h3>💬 더 궁금한 게 있다면?</h3>
          <p>
            qorrudgma@naver.com 또는 서비스 하단 문의 버튼을 이용해주세요!<br />
            Findy는 당신의 질문을 데이터로 삼아 더 똑똑해집니다.<br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 