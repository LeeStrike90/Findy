from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

# test
def test():
    try:
        client = MongoClient("mongodb://localhost:27017")  # MongoDB 연결
        # client = MongoClient("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000")  # MongoDB 연결
        # MongoDB 보안 테스트
        # client = MongoClient("mongodb://mongoadmin:1234@localhost:27017/?authSource=admin&replicaSet=rs0&directConnection=true", serverSelectionTimeoutMS=5000)
        info = client.server_info()
        print("MongoDB 연결 성공:", info["version"])
    except ServerSelectionTimeoutError as e:
        print("MongoDB 연결 실패:", e)

def save_to_mongodb(articles):
    # 연결 확인되면 아래 두줄 주석
    # print("----------------디비 연결 시작----------------")
    test()    
    print("==================디비 저장 시작==================")
    try:
        client = MongoClient("mongodb://localhost:27017")  # MongoDB 연결
        # client = MongoClient("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000")  # MongoDB 연결
        # MongoDB 보안 테스트
        # client = MongoClient("mongodb://mongoadmin:1234@localhost:27017/newsdata?authSource=admin&replicaSet=rs0")
        # client = MongoClient("mongodb://mongoadmin:1234@localhost:27017/?authSource=admin&replicaSet=rs0&directConnection=true", serverSelectionTimeoutMS=5000)  # MongoDB 보안 테스트

        db = client["newsdata"]  # DB 선택
        collection = db["newsdata"]  # 컬렉션 선택

        total = len(articles)
        unique_post_ids = set()
        inserted = 0
        skipped = 0

        for article in articles:
            # print(f" !@#$ url: {article['url']}\n")
            url = article.get('url')
            if not url:
                skipped += 1
                continue

            unique_post_ids.add(url)

            result = collection.update_one(
                {"url": url},
                {"$set": article},
                upsert=True
            )
            if result.upserted_id or result.modified_count:
                inserted += 1

        # 결과 출력
        print(f"\n 전체 수집 기사 수: {total}건")
        print(f" 고유 post_id 수: {len(unique_post_ids)}건")
        print(f" 저장 또는 갱신: {inserted}건")
        print(f" post_id 누락으로 스킵된 건수: {skipped}건")

    except Exception as e:
        print(f"[MongoDB 오류] {e}")

print('시작')
test()
print('끝')