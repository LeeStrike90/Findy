import re

from konlpy.tag import Komoran

# 텍스트 전처리 함수
def clean_text(text):
    if not text:
        return ""
    
    # 1. 줄바꿈 문자 제거
    text = text.replace('\n', ' ').replace('\r', ' ')
    
    # 2. 특수 문자 정리 (한글, 영문, 숫자, 공백, 마침표/쉼표만 허용)
    text = re.sub(r'[^\uAC00-\uD7A3a-zA-Z0-9\s.,]', ' ', text)

    # 3. 유니코드 이상문자 변환
    text = text.replace('…', '...').replace('“', '"').replace('”', '"').replace("’", "'")

    # 4. 공백 정리
    text = re.sub(r'\s+', ' ', text).strip()

    return text

# Komoran 분석 함수
def komoran(text):
    komoran = Komoran()
    try:
        cleaned = clean_text(text)
        
        # 본문이 너무 짧은 경우 예외 처리
        if len(cleaned) < 3:
            print("본문이 너무 짧아 형태소 분석 생략")
            return [], []
        
        pos_result = komoran.pos(cleaned)
        nouns = [
            word for word, tag in pos_result 
            if word and tag and tag in ['NNG', 'NNP'] and len(word) > 1
        ]
        return nouns, pos_result
    
    except Exception as e:
        print("Komoran 분석 오류:", e)
        return [], []