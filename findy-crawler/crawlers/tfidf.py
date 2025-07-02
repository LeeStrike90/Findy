
from collections import defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer

def tf_idf(headline, text, pos_result, nouns):

    sentences = text.split('.')
    first_sentence = sentences[1] if len(sentences) > 1 else ""
    last_sentence = sentences[-1]
    position_weights = defaultdict(float)

    for word, tag in pos_result:
        if len(word) <= 1 or tag not in ['NNG', 'NNP']:
            continue
        if word in headline:
            position_weights[word] += 2.0
        if word in first_sentence:
            position_weights[word] += 1.5
        if word in last_sentence:
            position_weights[word] += 1.0
        if tag == 'NNP':
            position_weights[word] += 1.0

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([" ".join(nouns)])
    feature_names = vectorizer.get_feature_names_out()
    tfidf_scores = tfidf_matrix.toarray()[0]

    tfidf_keywords = []
    for word, score in zip(feature_names, tfidf_scores):
        final_score = score + position_weights.get(word, 0)
        tfidf_keywords.append((word, final_score))
    tfidf_keywords = sorted(tfidf_keywords, key=lambda x: x[1], reverse=True)

    # return tfidf_keywords[:10]
    # 키워드만 추출
    return [word for word, _ in tfidf_keywords[:10]]