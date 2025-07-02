import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# MongoDB 설정
MONGODB_HOST = os.getenv('MONGODB_HOST', 'localhost')
MONGODB_PORT = int(os.getenv('MONGODB_PORT', 27017))
MONGODB_DATABASE = os.getenv('MONGODB_DATABASE', 'newsdata')
MONGODB_COLLECTION = os.getenv('MONGODB_COLLECTION', 'newsdata')

# 크롤링 설정
CRAWL_DELAY = int(os.getenv('CRAWL_DELAY', 1))  # 초 단위
MAX_ARTICLES_PER_SITE = int(os.getenv('MAX_ARTICLES_PER_SITE', 100))

# 로그 설정
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_DIR = os.getenv('LOG_DIR', 'logs')

# API 설정
API_HOST = os.getenv('API_HOST', '0.0.0.0')
API_PORT = int(os.getenv('API_PORT', 8001))

# 뉴스 사이트 URLs
NEWS_SITES = {
    'chosun': 'https://www.chosun.com',
    'donga': 'https://www.donga.com',
    'edaily': 'https://www.edaily.co.kr',
    'hani': 'https://www.hani.co.kr',
    'khan': 'https://www.khan.co.kr',
    'yna': 'https://www.yna.co.kr'
} 