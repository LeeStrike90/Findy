# 필요한 모듈들을 니코니코니~
import time  # 대기 시간 제어용
import threading  # 스레드 간 동기화에 사용

#  리소스 정리 및 명시적 종료 처리 추가
############# 종료 후 자원반납################
import sys
import threading
from jpype import isJVMStarted, shutdownJVM
#############################################

from concurrent.futures import ThreadPoolExecutor  # 병렬처리를 위한 ThreadPool
from selenium import webdriver  # 웹 페이지 조작을 위한 Selenium
from selenium.webdriver.chrome.options import Options  # Chrome 옵션 설정
from bs4 import BeautifulSoup  # HTML 파싱 라이브러리
from urllib.parse import urljoin, urlparse  # URL 병합 및 파싱용
from komoran import komoran # 형태소
from tfidf import tf_idf # TF-IDF
from textrank import textrank_keywords, textrank_summarize # TextRank
from mongo_save import save_to_mongodb # MongoDB

# ======================
# 카테고리 미리 선언해주자 
# ======================
CATEGORY_MAP = {
    "economy": "경제",
    "opinion": "오피니언",
    "national": "사회",
    "health": "건강",
    "sports": "스포츠",
    "culture": "문화/연예"
}

ALLOWED_CATEGORIES = set(CATEGORY_MAP.keys())

# ======================
# [1] Selenium 드라이버 설정 함수 정의
# ======================
def get_driver():
    options = Options()  # Chrome 실행 옵션 객체 생성
    options.add_argument("--headless=new")  # 브라우저를 백그라운드(화면 없이) 실행
    options.add_argument("--no-sandbox")  # 보안 샌드박스 해제 (리눅스에서 필요)
    options.add_argument("--disable-dev-shm-usage")  # 공유 메모리 사용 제한 해제
    options.add_argument(
        # 사용자 에이전트 설정: 서버에서 봇 차단을 피하기 위해 일반 브라우저처럼 위장
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    )
    return webdriver.Chrome(options=options)  # 설정된 옵션으로 Chrome 드라이버 실행

# ======================
# [2] 메인 페이지에서 뉴스 카테고리 링크 추출
# ======================
def get_category_links():
    url = "https://www.chosun.com/"  # 조선일보 메인 주소
    driver = get_driver()  # 웹드라이버 생성
    category_links = set()  # 중복 방지를 위한 set

    try:
        driver.get(url)  # 메인 페이지 요청
        soup = BeautifulSoup(driver.page_source, "html.parser")  # HTML 파싱

        # a 태그를 모두 검사하여 뉴스 카테고리 관련 링크만 필터링
        for a_tag in soup.select("a"):
            href = a_tag.get("href")
            if href and href.startswith("/") and any(cat in href for cat in [
                "/politics/", "/economy/", "/sports/", "/culture/",
                "/international/", "/national/", "/opinion/",
                "/entertainments/", "/game/", "/health/", "/sisa/"
            ]):
                full_url = urljoin(url, href.split("?")[0].split("#")[0])  # 절대경로로 정제
                category_links.add(full_url)  # 중복 없이 저장

    except Exception as e:
        print(f"[에러] 카테고리 수집 실패: {e}")
    finally:
        driver.quit()  # 드라이버 종료

    return list(category_links)  # set → list 변환 후 반환

# ======================
# [3] 기사 상세 페이지에서 제목, 본문, 날짜 등 추출
# ======================
def extract_article_data(driver, article_url, category_name):
    try:
        driver.get(article_url)  # 기사 페이지 요청
        time.sleep(1)  # 로딩 대기
        soup = BeautifulSoup(driver.page_source, "html.parser")  # HTML 파싱

        title_tag = soup.select_one("meta[property='og:title']")  # 제목 추출용 메타 태그
        title = title_tag["content"] if title_tag else ""

        content = ""  # 기사 본문 초기화
        section = soup.select_one("section.article-body[itemprop='articleBody']")  # 본문 섹션 찾기
        if section:
            paragraphs = section.find_all("p")  # <p> 단위로 분리
            content = "\n".join(p.get_text(strip=True) for p in paragraphs)

        if not content:  # 백업 선택자 사용
            fallback = soup.select_one("div.article-body") or soup.select_one("div#article-body")
            if fallback:
                paragraphs = fallback.find_all("p")
                content = "\n".join(p.get_text(strip=True) for p in paragraphs)


        ## 이미지 URL 추출
        img_url = ""
        img_tag = soup.select_one("meta[property='og:image']")
        if img_tag and img_tag.get("content"):
            img_url = img_tag["content"]


        if content:
            # print(f"내용: {clean_text}\n")
            # 형태소
            nouns, pos_result = komoran(content)
            # TF-IDF
            tfidf_keywords = tf_idf(title, content, pos_result, nouns)
            # TextRank
            textrank_kw = textrank_keywords(nouns)
        else:
            print(f"내용 없음{content}")

        pub_time = soup.select_one("meta[property='article:published_time']")  # 발행일 추출
        published_at = pub_time["content"] if pub_time else None

        # 중요 내용
        sentences = [s.strip() for s in content.split('.') if len(s.strip()) > 10]
        summary_sentences = textrank_summarize(sentences, top_k=3)

        # post_id = urlparse(article_url).path.rstrip("/").split("/")[-1]  # URL에서 post_id 추출
        post_id = article_url  # 걍 URL을 post_id 느낌으로 사용

        return {
            "headline": title,
            "url": article_url,  # ← 이걸 중복 체크 기준으로도 사용
            "content": content,
            "time": published_at,
            "tfidf_keywords": tfidf_keywords,
            "textrank_keywords": textrank_kw,
            "summary": summary_sentences,
            "category": category_name,
            "source": "chosun",
            "img":img_url
        }

    except Exception as e:
        print(f"[본문 추출 실패] {article_url} → {e}")
        return None

# ======================
# [4] 한 카테고리 내 기사 여러 페이지 수집
# ======================
def collect_articles_from_category(category_url, max_pages=3):
    path = urlparse(category_url).path
    category_key = path.strip("/").split("/")[0]  # "economy" 등 추출

    if category_key not in CATEGORY_MAP:
        print(f"[스킵] '{category_url}'은 대상 카테고리가 아님")
        return []

    category_name = CATEGORY_MAP[category_key]
    collected = []
    driver = get_driver()

    try:
        for page in range(1, max_pages + 1):
            page_url = f"{category_url}?page={page}"
            print(f"[카테고리] {category_name} → {page_url}")

            driver.get(page_url)
            time.sleep(1)
            soup = BeautifulSoup(driver.page_source, "html.parser")

            links = soup.select("a.story-card__headline")
            if not links:
                print(" 기사 없음, 중단")
                break

            for a_tag in links:
                href = a_tag.get("href")
                if not href:
                    continue
                article_url = urljoin(category_url, href)
                article_data = extract_article_data(driver, article_url, category_name)
                if article_data:
                    collected.append(article_data)

    except Exception as e:
        print(f"[페이지 오류] {category_url} → {e}")
    finally:
        driver.quit()

    return collected

# ======================
# [5] 메인 함수: 병렬 수집 및 저장 실행
# ======================
if __name__ == "__main__":
    categories = get_category_links()  # 카테고리 링크 수집
    print(f"\n📚 카테고리 수집 완료: {len(categories)}개")
    total_articles = []  # 전체 기사 리스트
    lock = threading.Lock()  # 동기화용 락 객체

    def process_category(cat_url):  # 각 카테고리 처리 함수
        articles = collect_articles_from_category(cat_url, max_pages=3)
        print(f"  {cat_url} → {len(articles)}건 수집됨")
        with lock:  # 동기화된 리스트 접근
            total_articles.extend(articles)

    with ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(process_category, categories)  # 병렬 수집 실행

    print(f"\n📰 총 수집된 기사 수: {len(total_articles)}")
    save_to_mongodb(total_articles)  # MongoDB 저장

############## 정상 종료 후 , 자원반납 ############
    # ✅ 크롤링 완료 로그
    print("[조선일보]  크롤링 및 저장 완료")
    # komoran JVM 종료
    if isJVMStarted():
        shutdownJVM()
        print("[chosun.py] 🔚 JVM 종료 완료")

    # 살아있는 스레드 출력 (디버깅용)
    for t in threading.enumerate():
        if t is not threading.main_thread():
            print(f"[chosun.py] 🧵 살아있는 스레드: {t.name}")

    # 프로세스 명시적 종료
    sys.exit(0)
