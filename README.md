# 🕵️‍♂️ Findy: 뉴스 검색 엔진

<img src="Findy_logo.png" alt="Findy 로고" width="200"/>

**Findy**는 다양한 뉴스 플랫폼에서 수집한 기사 데이터를 기반으로,  
📡 실시간 수집 + 🧠 형태소 분석 + 🔍 고속 검색 + 📊 랭킹 정렬 기능을 제공하는 **뉴스 검색 엔진**입니다.


---

## 🌟 주요 기능 (기여도: 상: ⭐ / 중: ★ / 하: ☆)

✅ *개발 완료 기능*

| 기능명 | 설명 | 기여도 |
|--------|------|--------|
| **웹 크롤러 기반 뉴스 수집** | Python 웹 로봇으로 다양한 뉴스 사이트에서 주기적으로 기사 수집 | 상 ⭐ |
| **형태소 분석 기반 키워드 처리** | Komoran 형태소 분석기로 키워드 추출 → 검색 정확도 향상 | 상 ⭐ |
| **TF-IDF 및 TextRank 기반 뉴스 랭킹** | 검색어와 뉴스 간의 연관성 점수를 계산해 랭킹 정렬 | 상 ⭐ |
| **MongoDB 뉴스 저장소** | 크롤링한 뉴스 데이터 저장 및 관리 | 상 ⭐ |
| **Elasticsearch 검색 인덱싱** | 분석된 뉴스 데이터를 빠르게 검색할 수 있도록 색인 처리 | 상 ⭐ |

⏳ *개발 예정 기능*

| 기능명 | 설명 |
|--------|------|
| **개인화 뉴스 추천** | 사용자 검색 이력을 바탕으로 맞춤형 뉴스 추천 제공 |
| **검색 자동완성** | 형태소 기반 실시간 키워드 추천 기능 |
| **감성 분석 기반 뉴스 태깅** | 긍정/부정 등 감성 기반 분류 표시 |
| **인기 키워드 트렌드 차트** | 현재 시점 기준 인기 키워드 시각화 |


---

## 🛠 기술 스택

- 🎨 Frontend<br>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" height="25" /> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" height="25" /> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" height="25" /> <img src="https://img.shields.io/badge/jQuery-0769AD?style=flat&logo=jquery&logoColor=white" height="25" /> <img src="https://img.shields.io/badge/React--61DAFB?style=flat&logo=react" height="25" />

- 🔧 Backend<br>
<img src="https://img.shields.io/badge/Java-17-007396?style=flat&logo=java&logoColor=white" height="25" /> <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=flat&logo=springboot&logoColor=white" height="25" />
<img src="https://img.shields.io/badge/AJAX-0054A6?style=flat&logo=code&logoColor=white" height="25" /> <img src="https://img.shields.io/badge/Fetch-00A9E0?style=flat&logo=javascript&logoColor=white" height="25" />

- 🔍 수집 및 처리 <br>
   <img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white" height="25" /> <img src="https://img.shields.io/badge/Komoran-형태소분석기-00B894?style=flat" height="25" /> <img src="https://img.shields.io/badge/TextRank-키워드추출-0984e3?style=flat" height="25" /> <img src="https://img.shields.io/badge/Web%20Robot-00B8D4?style=flat&logo=web&logoColor=white" height="25" />

- 🧠 검색 및 분석 <br>
   <img src="https://img.shields.io/badge/Elasticsearch-005571?style=flat&logo=elasticsearch&logoColor=white" height="25" />

- 💾 데이터 저장소 <br>
   <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white" height="25" /> <img src="https://img.shields.io/badge/MySQL-005C84?style=flat&logo=mysql&logoColor=white" height="25" /><br>

- ☁️ 실행 환경 (Infra)<br>
<img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" height="25" /><br>
`Elasticsearch / MongoDB / MySQL 실행 환경 구성용`

- 🛠 개발 도구 & 빌드<br>
   <img src="https://img.shields.io/badge/Gradle-02303A?style=flat&logo=gradle&logoColor=white" height="25" />


---

<details>
  <summary>📁 프로젝트 구조</summary>
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

## 📁 Python 프로젝트 구조

```
findy-crawler/
├── main.py                 # 메인 실행 파일
├── requirements.txt        # Python 의존성
├── README.md              # 이 파일
├── config/
│   ├── __init__.py
│   └── settings.py        # 설정 파일
├── crawlers/              # 뉴스 크롤러들
│   ├── __init__.py
│   ├── chosun.py         # 조선일보 크롤러
│   ├── donga.py          # 동아일보 크롤러
│   ├── edaily.py         # 이데일리 크롤러
│   ├── hani.py           # 한겨레 크롤러
│   ├── khan.py           # 경향신문 크롤러
│   ├── yna.py            # 연합뉴스 크롤러
│   ├── tfidf.py          # TF-IDF 분석
│   └── textrank.py       # TextRank 분석
├── utils/
│   ├── __init__.py
│   └── db_connector.py   # MongoDB 연결
└── logs/                 # 로그 파일들
```




## ERD
ERD이미지 삽입하기
