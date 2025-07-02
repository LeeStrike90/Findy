# 🕵️‍♂️ Findy: 뉴스 검색 엔진

<img src="Findy_logo_white.png" alt="Findy_white 로고" width="200" color="white"/> <img src="Findy_logo_black.png" alt="Findy 로고" width="200"/>

**Findy**는 다양한 뉴스 플랫폼에서 수집한 기사 데이터를 기반으로, 
📡 실시간 수집 + 🧠 형태소 분석 + 🔍 고속 검색 + 📊 랭킹 정렬 기능을 제공하는 **뉴스 검색 엔진**입니다.


---

## 🌟 주요 기능 (기여도: 상: ⭐ / 중: ★ / 하: ☆)
> 기능별 개발 현황과 기여도를 함께 표시합니다.

| 기능명 | 설명 | 기여도 |
|--------|------|--------|
| **다크모드** | 뉴스 검색 화면에서 다크모드를 지원하여 사용자 편의성 향상 | 상 ⭐ |
| **다국어 지원** | 메뉴 및 콘텐츠를 다국어로 설정 가능, 글로벌 사용자 편의성 제공 | 상 ⭐ |
| **웹 크롤러 기반 뉴스 수집** | Python 로봇으로 뉴스 사이트에서 기사 주기적 수집 | 상 ⭐ |
| **형태소 분석 기반 키워드 처리** | Komoran, TF-IDF, TextRank, nori로 키워드 추출 및 검색 | 상 ⭐ |
| **자동완성 기능** | 검색어 입력 시 실시간으로 관련 키워드 추천 | 상 ⭐ |
| **많이 본 기사 목록** | 사용자 열람 기준으로 인기 뉴스 목록 제공 (00:00 초기화) | 상 ⭐ |

⏳ *개발 예정 기능*

| 기능명 | 설명 | 진행 상황 |
|--------|------|-----------|
| **모바일지원** | 분석된 뉴스 데이터를 빠르게 검색할 수 있도록 색인 처리 | 중 ★ |
| **인기 키워드 트렌드 차트** | 현재 시점 기준 인기 키워드 시각화 | 중 ★ |
| **개인화 뉴스 추천** | 사용자 검색 이력을 바탕으로 맞춤형 뉴스 추천 제공 | 하 ☆ |


---

## 🛠 기술 스택

- 🎨 Frontend<br>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" height="25" /> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" height="25" /> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" height="25" /> <img src="https://img.shields.io/badge/React--61DAFB?style=flat&logo=react" height="25" />

- 🔧 Backend<br>
<img src="https://img.shields.io/badge/Java-17-007396?style=flat&logo=java&logoColor=white" height="25" /> <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=flat&logo=springboot&logoColor=white" height="25" />
<img src="https://img.shields.io/badge/AJAX-0054A6?style=flat&logo=code&logoColor=white" height="25" /> <img src="https://img.shields.io/badge/Fetch-00A9E0?style=flat&logo=javascript&logoColor=white" height="25" />

- 🔍 수집 및 처리 <br>
   <details>
     <summary><img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white" height="25" /></summary>
     <pre>
       <img src="https://img.shields.io/badge/Web%20Robot-00B8D4?style=flat&logo=web&logoColor=white" height="25" />
       <img src="https://img.shields.io/badge/Komoran-형태소분석기-00B894?style=flat" height="25" />
       <img src="https://img.shields.io/badge/TextRank-키워드추출-0984e3?style=flat" height="25" />
       <img src="https://img.shields.io/badge/TF--IDF-키워드추출-0984e3?style=flat" height="25" />
       <img src="https://img.shields.io/badge/Selenium-43B02A?style=flat&logo=selenium&logoColor=white" height="25" />
       <img src="https://img.shields.io/badge/BeautifulSoup-3C8039?style=flat&logo=beautifulsoup&logoColor=white" height="25" />
     </pre>
   </details>

- 🧠 검색 및 분석 <br>
   <img src="https://img.shields.io/badge/Elasticsearch-005571?style=flat&logo=elasticsearch&logoColor=white" height="25" />

- 💾 데이터 저장소 <br>
   <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white" height="25" /> <br>

- ☁️ 실행 환경 (Infra)<br>
<img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" height="25" /><br>
`Elasticsearch / MongoDB / MySQL 실행 환경 구성용`

- 🛠 개발 도구 & 빌드<br>
   <img src="https://img.shields.io/badge/Gradle-02303A?style=flat&logo=gradle&logoColor=white" height="25" />


---

<details>
  <summary>📁 전체 프로젝트 구조</summary>
  <pre>
```
Findy-main/
├── 🖥️ Findy/                    # Spring Boot 백엔드
│   ├── src/main/java/com/boot/
│   │   ├── controller/          # REST API 컨트롤러
│   │   ├── service/            # 비즈니스 로직
│   │   ├── dto/                # 데이터 전송 객체
│   │   └── repository/         # MongoDB 레포지토리
│   └── src/main/resources/     # 설정 파일
├── 🎨 findy-frontend/           # React 프론트엔드
│   ├── src/components/         # React 컴포넌트
│   ├── src/styles/            # CSS 스타일
│   └── public/                # 정적 파일
├── 🕷️ findy-crawler/           # Python 크롤러
│   ├── crawlers/              # 언론사별 크롤러
│   ├── config/                # 설정 파일
│   └── utils/                 # 유틸리티 함수
└── 📚 docs/                    # 문서 파일
```
  </pre>
</details>


## MongoDB
<img src="MongoDB.png" alt="MongoDB"/>


## Elasticsearch
<img src="Elasticsearch.png" alt="Elasticsearch"/>
