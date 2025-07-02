#!/usr/bin/env python3
# MongoDB에 저장된 뉴스 데이터 확인 스크립트

from pymongo import MongoClient
import json
from datetime import datetime

def view_news_data():
    try:
        # MongoDB 연결
        client = MongoClient('mongodb://localhost:27017/')
        db = client['newsdata']
        collection = db['newsdata']
        
        print("=" * 80)
        print("📰 MongoDB 뉴스 데이터 확인")
        print("=" * 80)
        
        # 전체 데이터 개수
        total_count = collection.count_documents({})
        print(f"📊 총 뉴스 개수: {total_count}건\n")
        
        if total_count == 0:
            print("❌ 저장된 뉴스가 없습니다.")
            return
        
        # 카테고리별 개수
        print("📈 카테고리별 뉴스 개수:")
        categories = collection.distinct("category")
        for category in categories:
            count = collection.count_documents({"category": category})
            print(f"  - {category}: {count}건")
        print()
        
        # 출처별 개수
        print("📺 출처별 뉴스 개수:")
        sources = collection.distinct("source")
        for source in sources:
            count = collection.count_documents({"source": source})
            print(f"  - {source}: {count}건")
        print()
        
        # 최근 뉴스 5개 표시
        print("🔥 최근 수집된 뉴스:")
        print("-" * 80)
        
        news_list = list(collection.find({}).limit(10))
        
        for i, news in enumerate(news_list, 1):
            print(f"\n[{i}] 📰 {news.get('headline', '제목 없음')}")
            print(f"    📂 카테고리: {news.get('category', '미분류')}")
            print(f"    📺 출처: {news.get('source', '알 수 없음')}")
            print(f"    🕒 시간: {news.get('time', '시간 없음')}")
            print(f"    🔗 URL: {news.get('url', '링크 없음')}")
            
            # 내용 일부 표시 (처음 100자)
            content = news.get('content', '')
            if content:
                content_preview = content[:100] + "..." if len(content) > 100 else content
                print(f"    📝 내용: {content_preview}")
            
            print(f"    🆔 MongoDB ID: {news.get('_id')}")
        
        print("\n" + "=" * 80)
        
        # 특정 키워드 검색 예제
        print("\n🔍 키워드 검색 테스트:")
        keywords = ["대통령", "경제", "야구", "스포츠"]
        
        for keyword in keywords:
            # 제목이나 내용에서 키워드 검색
            count = collection.count_documents({
                "$or": [
                    {"headline": {"$regex": keyword, "$options": "i"}},
                    {"content": {"$regex": keyword, "$options": "i"}}
                ]
            })
            print(f"  - '{keyword}' 관련 뉴스: {count}건")
        
        client.close()
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")

def view_detailed_news(news_id=None):
    """특정 뉴스의 상세 정보 출력"""
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['newsdata']
        collection = db['newsdata']
        
        if news_id:
            from bson import ObjectId
            news = collection.find_one({"_id": ObjectId(news_id)})
        else:
            news = collection.find_one({})  # 첫 번째 뉴스
        
        if news:
            print("\n" + "=" * 80)
            print("📰 뉴스 상세 정보")
            print("=" * 80)
            print(f"🆔 ID: {news.get('_id')}")
            print(f"📰 제목: {news.get('headline', '제목 없음')}")
            print(f"📂 카테고리: {news.get('category', '미분류')}")
            print(f"📺 출처: {news.get('source', '알 수 없음')}")
            print(f"🕒 발행시간: {news.get('time', '시간 없음')}")
            print(f"🔗 URL: {news.get('url', '링크 없음')}")
            print(f"\n📝 전체 내용:")
            print("-" * 40)
            print(news.get('content', '내용 없음'))
            print("-" * 40)
        else:
            print("❌ 뉴스를 찾을 수 없습니다.")
        
        client.close()
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")

if __name__ == "__main__":
    view_news_data()
    
    # 첫 번째 뉴스의 상세 정보도 표시
    print("\n" + "🔍 첫 번째 뉴스 상세 정보:")
    view_detailed_news() 