import requests
import time

from datetime import datetime
from bs4 import BeautifulSoup
from komoran import komoran # 형태소
from tfidf import tf_idf # TF-IDF
from textrank import textrank_keywords, textrank_summarize # TextRank
from mongo_save import save_to_mongodb # MongoDB

# 링크 추출
def fetch_headlines(category,page):
    page = page+1
    # f_url = f"https://www.donga.com/news/{category}?p={page}&prod=news&ymd=&m="
    f_url = f"https://www.hankyung.com/{category}?page={page}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    try:
        response = requests.get(f_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        news_headlines = []

        articles_ul = soup.select_one("ul.news-list")
        articles = articles_ul.select("h2.news-tit > a")
        
        for article in articles:
            if article:
                url = article.get("href")
                if url and not url.startswith("http"):
                    url = "https://www.hankyung.com" + url
                news_headlines.append({"url": url})
                # print("--------",news_headlines)
        # print("!@#$",news_headlines)
        return news_headlines
    except Exception as e:
        print(f"오류 발생: {e}")
        return []

# 기사 내용 추출 함수
def fetch_article_content(article_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    try:
        response = requests.get(article_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # 제목 추출
        headline_tags = soup.select_one("h1.headline")
        headline = headline_tags.get_text(separator=' ', strip=True)
        print(headline)

        # 이미지 추출
        div = soup.select_one("div.article-body-wrap")
        img_tag = div.select_one("img")
        img = img_tag.get("src")

        # 텍스트 내용이 태그들과 있어서 내용만 뽑아내기
        content_tag = soup.select_one("div.article-body")
        if content_tag:
            clean_text = content_tag.get_text(separator=' ', strip=True)
        # print(clean_text)

        # 보도시간 추출
        date_items = soup.select_one("span.txt-date")
        last_time = date_items.get_text(separator=' ', strip=True)

        last_time = last_time.replace('.','-')

        try:
            dt = datetime.strptime(last_time, "%Y-%m-%d %H:%M")
            last_time = dt.strftime("%Y-%m-%dT%H:%M:00.000Z")
            print(last_time)
        except ValueError:
            print("시간 형식 오류:", last_time)

        if clean_text:
            # print(f"내용: {clean_text}\n")
            # 형태소
            nouns, pos_result = komoran(clean_text)
            # TF-IDF
            tfidf_keywords = tf_idf(headline, clean_text, pos_result, nouns)
            # print(tfidf_keywords)
            # TextRank
            textrank_kw = textrank_keywords(nouns)
            # print(textrank_kw)
        else:
            print(f"내용 없음{clean_text}")
        print()

        # 중요 내용
        sentences = [s.strip() for s in clean_text.split('.') if len(s.strip()) > 10]
        summary_sentences = textrank_summarize(sentences, top_k=3)
        # print("!@#$!@#$!@#$",summary_sentences)

        return {
            "headline": headline,
            "img": img,
            "content": clean_text,
            "tfidf_keywords": tfidf_keywords,
            "textrank_keywords": textrank_kw,
            "url": article_url,
            "category": category,
            "source": "hankyung",
            "summary": summary_sentences,
            "time": last_time
        }

    except Exception as e:
        print(f"본문 크롤링 오류: {e}")
        return None
    
def convert_category(cat):
    for key in category_mapping:
        if key in cat:
            return category_mapping[key]
    return cat

# 실행 흐름
# hankyung 전용 매핑
category_mapping = {
    # 경제
    "economy/economic-policy": "경제",
    "economy/macro": "경제",
    "economy/forex": "경제",
    "economy/tax": "경제",
    "economy/job-welfare": "경제",
    # 오피니언
    "opinion/0001": "오피니언",
    "opinion/0002": "오피니언",
    "opinion/0003": "오피니언",
    # 사회
    "society/incidents": "사회",
    "society/education": "사회",
    "society/administration": "사회",
    "society/local": "사회",
    "society/employment": "사회",
    # 스포츠
    "sports": "스포츠",
    # 연예/문화
    "culture": "연예/문화",
    "entertainment/2001": "연예/문화",
    "entertainment/2002-2003": "연예/문화",
    "entertainment/2004": "연예/문화",
    "entertainment/2005": "연예/문화",
    "entertainment/2006": "연예/문화"
}

# 건강은 없음
categories = [
    # 경제
    "economy/economic-policy",
    "economy/macro",
    "economy/forex",
    "economy/tax",
    "economy/job-welfare",
    # 오피니언
    "opinion/0001",
    "opinion/0002",
    "opinion/0003",
    # 사회
    "society/incidents",
    "society/education",
    "society/administration",
    "society/local",
    "society/employment",
    # 스포츠
    "sports",
    # 문화/연예
    "culture",
    "entertainment/2001",
    "entertainment/2002-2003",
    "entertainment/2004",
    "entertainment/2005",
    "entertainment/2006"
]
# categories = ["opinion/0003"]
data = []
for category in categories:
    print("hankyung - ", category)
    # 반복할 페이지 수
    for i in range(20):
        headlines = fetch_headlines(category, i)

        if headlines:
            for idx, item in enumerate(headlines, start=1):
                article = fetch_article_content(item["url"])

                if article:
                    # 출력전에 교체
                    converted_category = convert_category(category)
                    article["category"] = converted_category

                    print("결과 => ")
                    for key, value in article.items():
                        print(f"{key}:\n{value}\n")

                    data.append(article)
                else:
                    print("기사 본문 크롤링 실패\n")

                time.sleep(0.5)
        else:
            print("1번 크롤러 실패.")

# 디비 저장
save_to_mongodb(data)