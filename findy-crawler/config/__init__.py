# config 패키지

from .settings import *

__all__ = [
    'MONGODB_HOST',
    'MONGODB_PORT', 
    'MONGODB_DATABASE',
    'MONGODB_COLLECTION',
    'CRAWL_DELAY',
    'MAX_ARTICLES_PER_SITE',
    'LOG_LEVEL',
    'LOG_DIR',
    'API_HOST',
    'API_PORT',
    'NEWS_SITES'
] 