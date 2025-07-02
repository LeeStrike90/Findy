// 뉴스 기사 인터페이스
export interface NewsArticle {
  id?: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  publishedAt: string;
  date?: string;
  tags: string[];
  url: string;
  author?: string;
  source?: string;
}

// 검색 응답 인터페이스
export interface SearchResponse {
  content: NewsArticle[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// 카테고리 타입
export type CategoryType = '전체' | '경제' | '오피니언' | '사회' | '건강' | '연예/문화' | '스포츠';

// 검색 파라미터 인터페이스
export interface SearchParams {
  q?: string;
  category?: string;
  page?: number;
  size?: number;
}

// API 응답 기본 인터페이스
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
} 