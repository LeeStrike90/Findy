import requests
import json

ELASTIC_URL = "https://localhost:9200"
INDEX = "unique_keywords"
AUTH = ('elastic', 'qwer1234')
VERIFY_SSL = False

# newsdata.newsdata에서 키워드 추출
def fetch_keywords():
    keywords_set = set()
    from_ = 0
    size = 1000

    while True:
        query = {
            "_source": ["tfidf_keywords", "textrank_keywords"],
            "from": from_,
            "size": size
        }

        resp = requests.get(f"{ELASTIC_URL}/newsdata.newsdata/_search",
                            headers={"Content-Type": "application/json"},
                            auth=AUTH,
                            verify=VERIFY_SSL,
                            json=query)

        hits = resp.json()['hits']['hits']
        if not hits:
            break

        for hit in hits:
            src = hit["_source"]
            for field in ["tfidf_keywords", "textrank_keywords"]:
                for kw in src.get(field, []):
                    keywords_set.add(kw.strip())

        from_ += size
        print(f"Fetched: {from_} keywords so far...")

    return keywords_set

# 중복 제거된 키워드들을 unique_keywords 인덱스에 저장
def index_keywords(keywords):
    bulk_data = ""
    for keyword in keywords:
        action = { "index": { "_index": INDEX } }
        doc = {
            "keyword": keyword,
            "keyword_suggest": { "input": [keyword] }
        }
        bulk_data += json.dumps(action, ensure_ascii=False) + "\n"
        bulk_data += json.dumps(doc, ensure_ascii=False) + "\n"

    response = requests.post(f"{ELASTIC_URL}/_bulk",
                             headers={"Content-Type": "application/json"},
                             auth=AUTH,
                             verify=VERIFY_SSL,
                             data=bulk_data.encode('utf-8'))

    print("Bulk index result:", response.json())

# 실행
if __name__ == "__main__":
    print("키워드 수집 중...")
    keywords = fetch_keywords()
    print(f"중복 제거된 키워드 수: {len(keywords)}개")
    print("Elasticsearch에 저장 중...")
    index_keywords(keywords)