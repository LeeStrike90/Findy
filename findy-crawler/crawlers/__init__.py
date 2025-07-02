# crawlers 패키지

from .chosun import main as chosun_crawler
from .donga import main as donga_crawler
from .edaily import main as edaily_crawler
from .hani import main as hani_crawler
from .khan import main as khan_crawler
from .yna import main as yna_crawler

__all__ = [
    'chosun_crawler',
    'donga_crawler', 
    'edaily_crawler',
    'hani_crawler',
    'khan_crawler',
    'yna_crawler'
] 