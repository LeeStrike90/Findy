# 🔗 **실제 데이터 연동 구현 가이드**

## 📋 **개요**
더미 데이터를 실제 백엔드 API와 연동하여 진짜 뉴스 데이터를 표시하는 방법을 설명합니다.

---

## 🚀 **1. 현재 구현 상태**

### ✅ **완료된 작업**
- ✅ `index.html` - 실제 API 호출로 변경 완료
- ✅ 로딩 상태 및 오류 처리 추가
- ✅ 카테고리별 필터링 API 연동
- ✅ 인기 검색어 API 연동
- ✅ 실시간 검색 기능 (디바운스 적용)

### 🔧 **사용하는 API 엔드포인트**
```
GET /api/search?q={검색어}&page=0&size=12&category={카테고리}
GET /api/search/autocomplete?q={검색어}
GET /api/search/popular
```

---

## 🛠 **2. 백엔드 API 연동 단계**

### **STEP 1: 로고 파일 설정**
```bash
# static/images 디렉토리 생성
cd Findy-main/Findy/src/main/resources/static
mkdir images

# 로고 파일 복사
copy ..\..\..\..\Findy_logo.png images\Findy_logo.png
```

### **STEP 2: MongoDB 연결 설정**
1. **MongoDB 서버 시작**
   ```bash
   # Windows
   net start MongoDB
   
   # 또는 MongoDB Compass 실행
   ```

2. **application.properties 확인**
   ```properties
   # MongoDB 설정
   spring.data.mongodb.host=localhost
   spring.data.mongodb.port=27017
   spring.data.mongodb.database=findy
   
   # Elasticsearch 설정 (필요시)
   spring.elasticsearch.uris=http://localhost:9200
   ```

### **STEP 3: 데이터베이스 초기 데이터 준비**
```javascript
// MongoDB에 샘플 뉴스 데이터 삽입 (MongoDB Compass 사용)
db.news.insertMany([
  {
    title: "AI 기술의 급속한 발전",
    content: "인공지능 기술이 의료, 교육, 금융 분야에서 혁신을 이끌고 있습니다.",
    category: "IT과학",
    author: "김기자",
    publishedAt: new Date(),
    tags: ["AI", "기술", "혁신"],
    url: "https://example.com/news/1"
  },
  {
    title: "경제 회복 조짐, 주식시장 상승",
    content: "국내 경제가 회복세를 보이며 코스피가 상승하고 있습니다.",
    category: "경제",
    author: "박기자",
    publishedAt: new Date(),
    tags: ["경제", "주식", "코스피"],
    url: "https://example.com/news/2"
  }
]);
```

---

## 🔄 **3. API 응답 형태 확인**

### **검색 API 응답 예시**
```json
{
  "content": [
    {
      "id": "news001",
      "title": "뉴스 제목",
      "content": "뉴스 내용...",
      "category": "정치",
      "author": "기자명",
      "publishedAt": "2025-06-02T10:00:00Z",
      "tags": ["태그1", "태그2"],
      "url": "https://news-url.com",
      "score": 0.95
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 12
  },
  "totalElements": 150,
  "totalPages": 13,
  "number": 0,
  "size": 12
}
```

### **인기 검색어 API 응답 예시**
```json
[
  "코로나",
  "경제",
  "정치",
  "스포츠",
  "연예"
]
```

---

## 🔧 **4. SearchController 수정 사항**

### **필요한 경우 SearchController 수정**
```java
@RestController
@RequestMapping("/api/search")
public class SearchController {
    
    @GetMapping
    public ResponseEntity<Page<NewsDocument>> search(
        @RequestParam String q,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String category
    ) {
        try {
            Page<NewsDocument> results = searchService.search(q, category, page, size);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<String>> getPopularQueries() {
        try {
            List<String> popular = searchService.getPopularQueries();
            return ResponseEntity.ok(popular);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }
}
```

---

## 🚨 **5. 문제 해결 방법**

### **MongoDB 연결 오류**
```bash
# 1. MongoDB 서비스 상태 확인
net start MongoDB

# 2. 포트 확인
netstat -an | findstr :27017

# 3. MongoDB 로그 확인
type "C:\Program Files\MongoDB\Server\7.0\log\mongod.log"
```

### **API 호출 실패 처리**
```javascript
// 현재 구현된 에러 핸들링
try {
    const response = await fetch(`${API_BASE}?q=${query}`);
    if (!response.ok) {
        throw new Error('API 호출 실패');
    }
    const data = await response.json();
    // 성공 처리
} catch (error) {
    console.error('오류:', error);
    // 더미 데이터로 폴백
    loadDummyData();
}
```

### **CORS 문제 해결**
```java
// WebConfig.java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8485")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

---

## 📊 **6. 데이터 소스 확장**

### **외부 뉴스 API 연동**
```java
// 뉴스 API 연동 서비스
@Service
public class NewsApiService {
    
    @Value("${news.api.key}")
    private String apiKey;
    
    public List<NewsDocument> fetchLatestNews() {
        // 외부 뉴스 API 호출
        // JSON 파싱 후 NewsDocument로 변환
        // MongoDB에 저장
    }
}
```

### **크롤링 데이터 연동**
```java
// 웹 크롤링 서비스
@Service
public class NewsCrawlerService {
    
    @Scheduled(fixedRate = 3600000) // 1시간마다
    public void crawlNews() {
        // 뉴스 사이트 크롤링
        // 데이터 정제 및 저장
    }
}
```

---

## 🎯 **7. 성능 최적화**

### **캐싱 적용**
```java
@Service
public class SearchService {
    
    @Cacheable(value = "popular-queries", key = "'popular'")
    public List<String> getPopularQueries() {
        // 인기 검색어 조회
    }
    
    @Cacheable(value = "search-results", key = "#query + '_' + #page")
    public Page<NewsDocument> search(String query, int page) {
        // 검색 결과 조회
    }
}
```

### **페이지네이션 개선**
```javascript
// 무한 스크롤 구현
let currentPage = 0;
let isLastPage = false;

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        if (!isLoading && !isLastPage) {
            loadMoreNews();
        }
    }
});
```

---

## 🔍 **8. 테스트 방법**

### **API 테스트**
```bash
# 검색 API 테스트
curl "http://localhost:8485/api/search?q=뉴스&page=0&size=5"

# 인기 검색어 API 테스트
curl "http://localhost:8485/api/search/popular"
```

### **브라우저 개발자 도구 확인**
1. **Network 탭**: API 호출 상태 확인
2. **Console 탭**: JavaScript 오류 확인
3. **Application 탭**: 로컬 스토리지 확인

---

## 📝 **9. 배포 고려사항**

### **환경 변수 설정**
```properties
# production 환경
spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/findy}
spring.elasticsearch.uris=${ELASTICSEARCH_URI:http://localhost:9200}
news.api.key=${NEWS_API_KEY}
```

### **도커 컨테이너 설정**
```dockerfile
FROM openjdk:17-jre-slim
COPY target/findy-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8485
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

---

## ✅ **10. 체크리스트**

- [ ] MongoDB 서버 실행
- [ ] 로고 이미지 복사 완료
- [ ] API 엔드포인트 정상 동작 확인
- [ ] 더미 데이터 대신 실제 데이터 표시
- [ ] 카테고리 필터링 동작 확인
- [ ] 검색 기능 정상 동작 확인
- [ ] 인기 검색어 표시 확인
- [ ] 오류 처리 동작 확인
- [ ] 로딩 상태 표시 확인
- [ ] 반응형 디자인 확인

---

## 🎉 **완료 후 확인**

1. **서버 시작**: `./gradlew bootRun`
2. **브라우저 접속**: `http://localhost:8485`
3. **기능 테스트**: 검색, 카테고리 변경, 클릭 이벤트
4. **개발자 도구**: 콘솔 오류 확인

**실제 뉴스 데이터가 표시되면 연동 완료!** 🎊 