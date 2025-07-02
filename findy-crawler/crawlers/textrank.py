import networkx as nx

from sklearn.feature_extraction.text import TfidfVectorizer

def textrank_keywords(nouns, window_size=4, top_k=10):
    graph = nx.Graph()
    for i in range(len(nouns)):
        for j in range(i+1, min(i + window_size, len(nouns))):
            if nouns[i] != nouns[j]:
                graph.add_edge(nouns[i], nouns[j], weight=1.0)
    scores = nx.pagerank(graph)
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    # return ranked[:top_k]
    # 키워드만 추출
    return [keyword for keyword, _ in ranked[:top_k]]

def textrank_summarize(sentences, top_k=3):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(sentences)

    similarity_graph = nx.Graph()
    for i in range(len(sentences)):
        for j in range(i + 1, len(sentences)):
            similarity = (tfidf_matrix[i] @ tfidf_matrix[j].T).toarray()[0][0]
            if similarity > 0:
                similarity_graph.add_edge(i, j, weight=similarity)

    scores = nx.pagerank(similarity_graph)
    ranked_sentences = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [sentences[idx] for idx, _ in ranked_sentences[:top_k]]


