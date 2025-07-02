import requests
import time

from bs4 import BeautifulSoup
from konlpy.tag import Okt
# from konlpy.tag import Komoran
from sklearn.feature_extraction.text import TfidfVectorizer
from mongo_save import save_to_mongodb

# 링크 추출
def fetch_headlines(category,page):
    f_url = f"https://www.hani.co.kr/arti/{category}?page={page}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    try:
        response = requests.get(f_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        news_headlines = []

        articles = soup.select("li.ArticleList_item___OGQO")
        for article in articles:
            link_tag = article.select_one("a.BaseArticleCard_link__Q3YFK")
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
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    try:
        response = requests.get(article_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # 제목 추출
        headline_tag = soup.select_one("h3.ArticleDetailView_title__9kRU_")
        headline = headline_tag.text.strip() if headline_tag else "제목 없음"
        # 텍스트 클래스가 여러개라 여러개를 합치는 작업
        content_tag = soup.select("p.text")
        # 처음 꺼로 하면 전부다인데 전부다 하면 마지막에 기자들 이름도 나와서 제외
        # paragraphs = [tag.get_text(strip=True) for tag in content_tag]
        paragraphs = [tag.get_text(strip=True) for tag in content_tag[:-1]]
        full_text = " ".join(paragraphs)
        # full_text = "!@#$!@#$".join(paragraphs)

    #-----Komoran------------------------------------------------
        # komoran = Komoran()
        # # morphs = komoran.morphs(full_text)

        # pos_result = komoran.pos(full_text)

        # # 명사(NNG, NNP)만 필터링 + 한 글자 단어 제외
        # nouns = [word for word, tag in pos_result if tag in ['NNG', 'NNP'] and len(word) > 1]
        # print("!@#$!@#$",nouns)

    #----Komoran-------------------------------------------------

    #------Okt--------------------------------------------------
        # okt 형태소 분석
        okt = Okt()
        nouns = okt.nouns(full_text)

        # 명사들을 모아 하나의 문서처럼 만듦
        document = " ".join(nouns)
    #------Okt--------------------------------------------------

        # 키워드 추출
        # TF-IDF 적용
        vectorizer = TfidfVectorizer()
        # tfidf_matrix = vectorizer.fit_transform(morphs)
        tfidf_matrix = vectorizer.fit_transform(nouns)
        # tfidf_matrix = vectorizer.fit_transform([full_text])
        # 중요도 (TF-IDF 점수)
        feature_names = vectorizer.get_feature_names_out()
        tfidf_scores = tfidf_matrix.toarray()[0]
        # 단어 점수 묶어서 내림차순 정렬
        word_tfidf = sorted(zip(feature_names, tfidf_scores), key=lambda x: x[1], reverse=True)

        date_items = soup.select("li.ArticleDetailView_dateListItem__mRc3d")
        for item in date_items:
            if "등록" in item.text:
                time = item.find("span").text.strip()
        # name = soup.select("div.ArticleDetailReporter_name__kXCEK strong")

        return {
            "headline": headline,
            "content": full_text,
            "keyword": word_tfidf,
            "url": article_url,
            "source":"hani",
            "time":time
        }

    except Exception as e:
        print(f"본문 크롤링 오류: {e}")
        return None

# 실행 흐름
# 카테고리 종류
# categories = ["economy", "opinion", "society", "hanihealth", "sports", "culture"]
# categories = ["economy", "opinion", "society", "hanihealth"]
categories = ["economy"]
data = []

for category in categories:
    # 반복할 페이지 수
    for i in range(1):
        headlines = fetch_headlines(category, i+1)

        if headlines:
            for idx, item in enumerate(headlines, start=1):
                print(f"@#@#@#@#@#@#기사 {idx}번 URL: {item['url']}")
                article = fetch_article_content(item['url'])

                if article:
                    # print(f"카테고리: {category}, 페이지: {i+1}")
                    # print(f" 제목: {article['headline']}")
                    # print(f" 내용: {article['content']}")
                    # print(f" 키워드: {article['keyword']}")
                    # print(f" 보도일: {article['time']}")
                    # print(f" 출처: {article['source']}")
                    # print(f" 링크: {article['url']}\n")
                    data.append(article)
                else:
                    print("기사 본문 크롤링 실패\n")

                time.sleep(0.5)
        else:
            print("1번 크롤러 실패.")

# 디비 저장
save_to_mongodb(data)