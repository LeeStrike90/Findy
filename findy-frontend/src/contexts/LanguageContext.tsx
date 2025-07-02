import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ko' | 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 번역 데이터
const translations = {
  ko: {
    // Header
    'header.search.placeholder': '뉴스, 키워드, 주제를 검색해보세요...',
    'header.categories.all': '전체',
    'header.categories.economy': '경제',
    'header.categories.opinion': '오피니언',
    'header.categories.society': '사회',
    'header.categories.health': '건강',
    'header.categories.entertainment': '연예/문화',
    'header.categories.sports': '스포츠',
    
    // Settings
    'settings.darkMode': '다크 모드',
    'settings.lightMode': '라이트 모드',
    'settings.language': '언어',
    'settings.korean': '한국어',
    'settings.english': 'English',
    'settings.japanese': '日本語',
    
    // Search Page
    'search.aiSummary': 'AI 요약',
    'search.aiAnalyzing': 'AI가 뉴스를 분석하고 있습니다...',
    'search.aiResult': '에 대한 AI 분석 결과가 여기에 표시됩니다.',
    'search.noResults': '검색 결과가 없습니다',
    'search.tryOther': '다른 검색어나 카테고리를 시도해보세요.',
    'search.news': '뉴스',
    'search.articles': '기사',
    'search.previous': '이전',
    'search.next': '다음',
    'search.firstPage': '첫 페이지',
    'search.lastPage': '마지막 페이지',
    'search.filters.latest': '최신순',
    'search.filters.oldest': '오래된순',
    'search.filters.title': '제목',
    'search.filters.content': '내용',
    'search.filters.period': '기간',
    'search.filters.reset': '초기화',
    'search.filters.close': '닫기',
    
    // Sidebar
    'sidebar.popularArticles': '많이 본 기사',
    'sidebar.newsSources': '언론사',
    'sidebar.loading': '로딩 중...',
    
    // Footer
    'footer.findyNews': 'Findy 뉴스',
    'footer.description1': 'AI 기반 뉴스 검색 엔진으로 정확하고 빠른 뉴스를 제공합니다.',
    'footer.description2': '신뢰할 수 있는 정보, 스마트한 검색 경험을 만나보세요.',
    'footer.services': '서비스',
    'footer.newsSearch': '뉴스 검색',
    'footer.categoryNews': '카테고리별 뉴스',
    'footer.popularSearch': '인기 검색어',
    'footer.realtimeNews': '실시간 뉴스',
    'footer.bookmark': '북마크',
    'footer.support': '고객지원',
    'footer.faq': '자주 묻는 질문',
    'footer.customerCenter': '고객센터',
    'footer.suggestion': '개선 제안',
    'footer.bugReport': '버그 신고',
    'footer.contact': '문의하기',
    'footer.policies': '정책 및 약관',
    'footer.terms': '이용약관',
    'footer.privacy': '개인정보처리방침',
    'footer.copyright': '저작권 정책',
    'footer.newsProvider': '뉴스 제공업체',
    'footer.adPolicy': '광고 정책',
    
    // HomePage
    'home.latestNews': '최신 뉴스',
    'home.subtitle': '실시간 검색으로 정확하고 빠른 뉴스를 만나보세요',
    'home.noNews': '뉴스가 없습니다',
    'home.tryLater': '잠시 후 다시 시도해주세요.',
    'home.moreNews': '더 많은 뉴스',
  },
  en: {
    // Header
    'header.search.placeholder': 'Search news, keywords, topics...',
    'header.categories.all': 'All',
    'header.categories.economy': 'Economy',
    'header.categories.opinion': 'Opinion',
    'header.categories.society': 'Society',
    'header.categories.health': 'Health',
    'header.categories.entertainment': 'Entertainment',
    'header.categories.sports': 'Sports',
    
    // Settings
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
    'settings.language': 'Language',
    'settings.korean': '한국어',
    'settings.english': 'English',
    'settings.japanese': '日本語',
    
    // Search Page
    'search.aiSummary': 'AI Summary',
    'search.aiAnalyzing': 'AI is analyzing the news...',
    'search.aiResult': 'AI analysis results will be displayed here.',
    'search.noResults': 'No search results',
    'search.tryOther': 'Try different keywords or categories.',
    'search.news': 'News',
    'search.articles': 'Articles',
    'search.previous': 'Previous',
    'search.next': 'Next',
    'search.firstPage': 'First Page',
    'search.lastPage': 'Last Page',
    'search.filters.latest': 'Latest',
    'search.filters.oldest': 'Oldest',
    'search.filters.title': 'Title',
    'search.filters.content': 'Content',
    'search.filters.period': 'Period',
    'search.filters.reset': 'Reset',
    'search.filters.close': 'Close',
    
    // Sidebar
    'sidebar.popularArticles': 'Popular Articles',
    'sidebar.newsSources': 'News Sources',
    'sidebar.loading': 'Loading...',
    
    // Footer
    'footer.findyNews': 'Findy News',
    'footer.description1': 'We provide accurate and fast news with AI-based news search engine.',
    'footer.description2': 'Meet reliable information and smart search experience.',
    'footer.services': 'Services',
    'footer.newsSearch': 'News Search',
    'footer.categoryNews': 'Category News',
    'footer.popularSearch': 'Popular Search',
    'footer.realtimeNews': 'Real-time News',
    'footer.bookmark': 'Bookmark',
    'footer.support': 'Customer Support',
    'footer.faq': 'FAQ',
    'footer.customerCenter': 'Customer Center',
    'footer.suggestion': 'Suggestions',
    'footer.bugReport': 'Bug Report',
    'footer.contact': 'Contact',
    'footer.policies': 'Policies & Terms',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.copyright': 'Copyright Policy',
    'footer.newsProvider': 'News Providers',
    'footer.adPolicy': 'Ad Policy',
    
    // HomePage
    'home.latestNews': 'Latest News',
    'home.subtitle': 'Meet accurate and fast news with real-time search',
    'home.noNews': 'No news available',
    'home.tryLater': 'Please try again later.',
    'home.moreNews': 'More News',
  },
  ja: {
    // Header
    'header.search.placeholder': 'ニュース、キーワード、トピックを検索...',
    'header.categories.all': '全て',
    'header.categories.economy': '経済',
    'header.categories.opinion': 'オピニオン',
    'header.categories.society': '社会',
    'header.categories.health': '健康',
    'header.categories.entertainment': 'エンタメ',
    'header.categories.sports': 'スポーツ',
    
    // Settings
    'settings.darkMode': 'ダークモード',
    'settings.lightMode': 'ライトモード',
    'settings.language': '言語',
    'settings.korean': '한국어',
    'settings.english': 'English',
    'settings.japanese': '日本語',
    
    // Search Page
    'search.aiSummary': 'AI要約',
    'search.aiAnalyzing': 'AIがニュースを分析しています...',
    'search.aiResult': 'のAI分析結果がここに表示されます。',
    'search.noResults': '検索結果がありません',
    'search.tryOther': '他のキーワードやカテゴリをお試しください。',
    'search.news': 'ニュース',
    'search.articles': '記事',
    'search.previous': '前へ',
    'search.next': '次へ',
    'search.firstPage': '最初のページ',
    'search.lastPage': '最後のページ',
    'search.filters.latest': '最新順',
    'search.filters.oldest': '古い順',
    'search.filters.title': 'タイトル',
    'search.filters.content': '内容',
    'search.filters.period': '期間',
    'search.filters.reset': 'リセット',
    'search.filters.close': '閉じる',
    
    // Sidebar
    'sidebar.popularArticles': '人気記事',
    'sidebar.newsSources': 'ニュースソース',
    'sidebar.loading': '読み込み中...',
    
    // Footer
    'footer.findyNews': 'Findy ニュース',
    'footer.description1': 'AI ベースのニュース検索エンジンで正確で迅速なニュースを提供します。',
    'footer.description2': '信頼できる情報、スマートな検索体験をお楽しみください。',
    'footer.services': 'サービス',
    'footer.newsSearch': 'ニュース検索',
    'footer.categoryNews': 'カテゴリ別ニュース',
    'footer.popularSearch': '人気検索',
    'footer.realtimeNews': 'リアルタイムニュース',
    'footer.bookmark': 'ブックマーク',
    'footer.support': 'カスタマーサポート',
    'footer.faq': 'よくある質問',
    'footer.customerCenter': 'カスタマーセンター',
    'footer.suggestion': '改善提案',
    'footer.bugReport': 'バグ報告',
    'footer.contact': 'お問い合わせ',
    'footer.policies': 'ポリシー・規約',
    'footer.terms': '利用規約',
    'footer.privacy': 'プライバシーポリシー',
    'footer.copyright': '著作権ポリシー',
    'footer.newsProvider': 'ニュース提供者',
    'footer.adPolicy': '広告ポリシー',
    
    // HomePage
    'home.latestNews': '最新ニュース',
    'home.subtitle': 'リアルタイム検索で正確で迅速なニュースをお届けします',
    'home.noNews': 'ニュースがありません',
    'home.tryLater': 'しばらくしてからもう一度お試しください。',
    'home.moreNews': 'もっとニュース',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ko');

  // 초기 언어 설정 로드
  useEffect(() => {
    const savedLanguage = localStorage.getItem('findy-language') as Language;
    if (savedLanguage && ['ko', 'en', 'ja'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // 언어 변경 함수
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('findy-language', newLanguage);
  };

  // 번역 함수
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 커스텀 훅
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 