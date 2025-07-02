from pymongo import MongoClient
from config.settings import MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE, MONGODB_COLLECTION
import logging

logger = logging.getLogger(__name__)

class MongoDBConnector:
    def __init__(self):
        self.client = None
        self.db = None
        self.collection = None
        
    def connect(self):
        """MongoDB에 연결"""
        try:
            self.client = MongoClient(f"mongodb://{MONGODB_HOST}:{MONGODB_PORT}/")
            self.db = self.client[MONGODB_DATABASE]
            self.collection = self.db[MONGODB_COLLECTION]
            logger.info(f"MongoDB 연결 성공: {MONGODB_HOST}:{MONGODB_PORT}/{MONGODB_DATABASE}")
            return True
        except Exception as e:
            logger.error(f"MongoDB 연결 실패: {e}")
            return False
    
    def save_articles(self, articles):
        """뉴스 기사들을 MongoDB에 저장"""
        if not self.collection:
            if not self.connect():
                return False
                
        try:
            total = len(articles)
            unique_urls = set()
            inserted = 0
            skipped = 0

            for article in articles:
                url = article.get('url')
                if not url:
                    skipped += 1
                    continue

                unique_urls.add(url)

                result = self.collection.update_one(
                    {"url": url},
                    {"$set": article},
                    upsert=True
                )
                if result.upserted_id or result.modified_count:
                    inserted += 1

            # 결과 출력
            logger.info(f"전체 수집 기사 수: {total}건")
            logger.info(f"고유 URL 수: {len(unique_urls)}건")
            logger.info(f"저장 또는 갱신: {inserted}건")
            logger.info(f"URL 누락으로 스킵된 건수: {skipped}건")
            
            return True

        except Exception as e:
            logger.error(f"MongoDB 저장 오류: {e}")
            return False
    
    def close(self):
        """MongoDB 연결 종료"""
        if self.client:
            self.client.close()
            logger.info("MongoDB 연결 종료")

# 전역 인스턴스
db_connector = MongoDBConnector() 