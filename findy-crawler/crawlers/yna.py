import requests
import time
from bs4 import BeautifulSoup
from mongo_save import save_to_mongodb

# 뉴스 목록에서 링크 추출
def fetch_headlines(category, page):
    f_url = f"https://www.yna.co.kr/{category}/all/{page}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    try:
        response = requests.get(f_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        news_headlines = []

        articles = soup.select("ul.list01")
        for article in articles:
            link_tag = article.select_one("a.tit-news")
            if link_tag:
                url = link_tag.get("href")
                if url and not url.startswith("http"):
                    url = "https:" + url
                news_headlines.append({"url": url})
        return news_headlines

    except Exception as e:
        print(f"[오류] 기사 목록 수집 실패: {e}")
        return []

# 기사 본문 추출
def fetch_article_content(article_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    try:
        response = requests.get(article_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # 제목
        headline_tags = soup.select("h1.tit01")

        # 내용
        content_tag = soup.select("div.story-news p")
        paragraphs = [tag.get_text(strip=True) for tag in content_tag[:-1]]
        full_text = " ".join(paragraphs)

        # 시간
        time_tag = soup.select_one("div.article-info span.update-time")
        published_time = time_tag.get_text(strip=True) if time_tag else "시간 없음"
        clean_time = clean_datetime(published_time)

        return {
            "headline": headline_tags,
            "content": full_text,
            "url": article_url,
            "source": "yna",
            "time": clean_time
        }

    except Exception as e:
        print(f"[오류] 본문 수집 실패: {e}")
        return None

# 날짜 포맷 정리
def clean_datetime(text):
    text = text.replace("기사입력 ", "")
    return text.replace(".", "-")

# 실행 흐름
# 카테고리 종류
# donga 전용 매핑
category_mapping = {
    "Economy": "경제",
    "Opinion": "오피니언",
    "Society": "사회",
    "Health": "건강",
    "Sports": "스포츠",
    "Culture": "연예/문화",
    "Entertainment": "연예/문화"
}
categories = ["economy", "politics", "society", "sports", "culture"]  # 연합뉴스 카테고리
data = []

print("=== 연합뉴스 크롤링 시작 ===")

for category in categories:
    print("yna - ", category)
    print(f"\n[카테고리] {category} 수집 중...")
    headlines = fetch_headlines(category, 1)  # 첫 페이지만

    if headlines:
        print(f"  ✓ {len(headlines)}개 기사 링크 발견")
        for idx, item in enumerate(headlines[:5], start=1):  # 각 카테고리당 5개만
            print(f"  기사 {idx}/5 수집 중...")
            article = fetch_article_content(item['url'])

            if article and article['content']:
                # headline이 리스트인 경우 첫 번째 요소 사용
                if isinstance(article['headline'], list):
                    article['headline'] = article['headline'][0].text.strip() if article['headline'] else "제목 없음"
                # 카테고리 매핑
                converted_category = category_mapping.get(category, category)
                article['category'] = category
                data.append(article)
                print(f"    ✓ 제목: {article['headline'][:50]}...")
            else:
                print(f"    ✗ 본문 수집 실패")

            time.sleep(0.5)
    else:
        print(f"  ✗ 기사 목록 수집 실패")

print(f"\n=== 수집 완료: 총 {len(data)}개 기사 ===")

if data:
    print("MongoDB에 저장 중...")
    save_to_mongodb(data)
    print("저장 완료!")
else:
    print("저장할 데이터가 없습니다.")
