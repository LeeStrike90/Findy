import requests
import time

from datetime import datetime
from bs4 import BeautifulSoup
from komoran import komoran # 형태소
from tfidf import tf_idf # TF-IDF
from textrank import textrank_keywords, textrank_summarize # TextRank
from mongo_save import save_to_mongodb # MongoDB

def fetch_headlines(category, page):
    f_url = f"https://www.hani.co.kr/arti/{category}?page={page}"
    print(f_url)
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(f_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        news_headlines = []

        articles = soup.select("li.ArticleList_item___OGQO")
        if not(articles):
            articles = soup.select("li.ArticleGalleryList_item__f39zX")
        for article in articles:
            link_tag = article.select_one("a.BaseArticleCard_link__Q3YFK")
            if not(link_tag):
                link_tag = article.select_one("a.BaseArticleCardVertical_link__3rmjA")
            if link_tag:
                url = link_tag.get("href")
                if url and not url.startswith("http"):
                    url = "https://www.hani.co.kr" + url
                news_headlines.append({"url": url})
        return news_headlines

    except Exception as e:
        print(f"오류 발생: {e}")
        return []
    
# 기사 내용 추출 함수
def fetch_article_content(article_url):
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(article_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # 제목
        headline_tag = soup.select_one("h3.ArticleDetailView_title__9kRU_")
        headline = headline_tag.text.strip() if headline_tag else "제목 없음"

        # 이미지 추출
        div = soup.select_one("div.ArticleDetailContent_imageContainer___o_gm")
        img_tag = div.select_one("img")
        img = img_tag.get("src")

        # 내용
        content_tag = soup.select("p.text")
        paragraphs = [tag.get_text(strip=True) for tag in content_tag[:-1]]
        full_text = " ".join(paragraphs)

        # 날짜 정보 파싱 (오류 방지 로직 추가)
        time_str = "알 수 없음"
        date_items = soup.select("li.ArticleDetailView_dateListItem__mRc3d")
        for item in date_items:
            if "등록" in item.text:
                time_tag = item.find("span")
                if time_tag:
                    time_str = time_tag.text.strip()

        last_time = time_str.replace('.','-')

        try:
            dt = datetime.strptime(last_time, "%Y-%m-%d %H:%M")
            last_time = dt.strftime("%Y-%m-%dT%H:%M:00.000Z")
            print(last_time)
        except ValueError:
            print("시간 형식 오류:", last_time)

        # 형태소
        nouns, pos_result = komoran(full_text)
        # TF-IDF
        tfidf_keywords = tf_idf(headline, full_text, pos_result, nouns)
        # TextRank
        textrank_kw = textrank_keywords(nouns)

        # 중요 내용
        sentences = [s.strip() for s in full_text.split('.') if len(s.strip()) > 10]
        summary_sentences = textrank_summarize(sentences, top_k=3)

        return {
            "headline": headline,
            "img": img,
            "content": full_text,
            "tfidf_keywords": tfidf_keywords,
            "textrank_keywords": textrank_kw,
            "url": article_url,
            "category": category,
            "source": "hani",
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
 
# hani 전용 매핑
category_mapping = {
    "economy": "경제",
    "opinion": "오피니언",
    "society": "사회",
    "health": "건강",
    "sports": "스포츠",
    "culture": "연예/문화"
}
# 실행
categories = ["economy", "opinion", "society", "health", "sports", "culture"]
# categories = ["culture"]
data = []
for category in categories:
    print("hani - ", category)
    for i in range(40):
        headlines = fetch_headlines(category, i + 1)
        if headlines:
            for idx, item in enumerate(headlines, start=1):
                # print(f"기사 {idx}번 URL: {item['url']}")
                article = fetch_article_content(item['url'])
                if article:
                    # 출력전에 교체
                    converted_category = convert_category(category)
                    article["category"] = converted_category

                    print("결과 => ")
                    for key, value in article.items():
                        print(f"{key}:\n{value}\n")
                    
                    data.append(article)
                else:
                    print("기사 본문 크롤링 실패")
                time.sleep(0.5)
        else:
            print("크롤링 실패")

save_to_mongodb(data)