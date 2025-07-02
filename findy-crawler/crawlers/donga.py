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
    page = (page*10)+1
    f_url = f"https://www.donga.com/news/{category}?p={page}&prod=news&ymd=&m="
    # print(f_url)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    try:
        response = requests.get(f_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        news_headlines = []

        articles_div = soup.select_one("div.divide_area > section.sub_news_sec")
        # print(articles_div)
        articles = articles_div.select("div.news_body > h4.tit > a")
        
        for article in articles:
            if article:
                url = article.get("href")
                if url and not url.startswith("http"):
                    url = "https://www.hani.co.kr" + url
                news_headlines.append({"url": url})
                # print("--------",news_headlines)
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
        headline_tags = soup.select("h1")

        # 두 번째 h1이 있으면 가져오고, 없으면 첫 번째 또는 기본값 사용
        if len(headline_tags) >= 2:
            headline = headline_tags[1].text.strip()
        elif len(headline_tags) == 1:
            headline = headline_tags[0].text.strip()
        else:
            headline = "제목 없음"

        # 크롤링할 section
        content_tag = soup.select_one("section.news_view")

        # 이미지 추출
        img_tag = content_tag.select_one("img")
        img = img_tag.get("src")

        # 텍스트 내용이 태그들과 있어서 내용만 뽑아내기
        if content_tag:
            clean_text = content_tag.get_text(separator=' ', strip=True)

        # 보도시간 추출
        date_items = soup.select('span[aria-hidden="true"]')
        last_time = date_items[-1].text.strip()

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
            # TextRank
            textrank_kw = textrank_keywords(nouns)
        else:
            print(f"내용 없음{clean_text}")

        # 중요 내용
        sentences = [s.strip() for s in clean_text.split('.') if len(s.strip()) > 10]
        summary_sentences = textrank_summarize(sentences, top_k=3)

        return {
            "headline": headline,
            "img":img,
            "content": clean_text,
            "tfidf_keywords": tfidf_keywords,
            "textrank_keywords": textrank_kw,
            "url": article_url,
            "category": category,
            "source": "donga",
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
# donga 전용 매핑
category_mapping = {
    "Economy": "경제",
    "Series": "오피니언",
    "Society/70040100000001": "사회",
    "Society/70040100000009": "사회",
    "Society/70040100000002": "사회",
    "Society/70040100000019": "사회",
    "Society/70040100000278": "사회",
    "Society/70040100000034": "사회",
    "Society/70010000000260": "사회",
    "Health": "건강",
    "Sports": "스포츠",
    "Culture": "연예/문화",
    "Entertainment": "연예/문화"
}
# category_list = ["70040100000001","70040100000009","70040100000002","70040100000019","70040100000278","70040100000034","70010000000260"]
# categories = ["Economy", "Series", "Society", "Health", "Sports", "Culture", "Entertainment"]

categories = ["Economy", "Series", "Society/70040100000001", "Society/70040100000009", "Society/70040100000002", "Society/70040100000019", "Society/70040100000278", "Society/70040100000034", "Society/70010000000260", "Health", "Sports", "Culture", "Entertainment"]
# categories = ["Economy"]
data = []
for category in categories:
    print("donga - ", category)
    # 반복할 페이지 수
    for i in range(30):
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