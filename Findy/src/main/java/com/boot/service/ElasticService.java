package com.boot.service; // 서비스 클래스가 포함된 패키지 선언

import java.io.IOException; // 입출력 예외 처리를 위한 클래스
import java.time.Instant;
import java.util.ArrayList; // 리스트 객체 생성을 위한 클래스
import java.util.Comparator;
import java.util.HashMap;
import java.util.List; // 리스트 타입 사용을 위한 인터페이스
import java.util.Map; // 결과 데이터를 키-값 형태로 다루기 위한 Map 인터페이스
import java.util.stream.Collectors;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.search.TrackHits;
import org.openkoreantext.processor.OpenKoreanTextProcessorJava;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.boot.elasticsearch.HangulComposer;
import com.boot.elasticsearch.KeyboardMapper;

import co.elastic.clients.elasticsearch.ElasticsearchClient; // Elasticsearch 클라이언트 클래스
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch.core.SearchRequest; // 검색 요청 객체
import co.elastic.clients.elasticsearch.core.SearchResponse; // 검색 응답 객체
import co.elastic.clients.elasticsearch.core.explain.Explanation;
import co.elastic.clients.elasticsearch.core.explain.ExplanationDetail;
import co.elastic.clients.elasticsearch.core.search.CompletionSuggestOption;
import co.elastic.clients.elasticsearch.core.search.Hit; // 검색 결과의 단일 항목 표현
import co.elastic.clients.elasticsearch.core.search.Suggestion;
import co.elastic.clients.util.NamedValue;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
public class ElasticService
{
    private final ElasticsearchClient client;
    private final ElasticsearchOperations operations;
    private final KeyboardMapper keyboardMapper;
    private final HangulComposer hangulComposer;
    private final GeminiService geminiService;

    public ElasticService(ElasticsearchClient client, ElasticsearchOperations operations, KeyboardMapper keyboardMapper,
                          HangulComposer hangulComposer, GeminiService geminiService)
    {
        this.client = client;
        this.operations = operations;
        this.keyboardMapper = keyboardMapper;
        this.hangulComposer = hangulComposer;
        this.geminiService = geminiService;
    }

    private List<Map<String, Object>> extractHits(SearchResponse<Map> response)
    {
        List<Map<String, Object>> results = new ArrayList<>();
        for (Hit<Map> hit : response.hits().hits())
        {
            results.add(hit.source());
        }
        return results;
    }

    /**
     * 뉴스 검색 및 AI 요약 포함 결과 반환
     */

    public Map<String, Object> searchWithPagination(String keyword, String category, String source, int page, int size, boolean isResearch) throws IOException
    {
        SearchRequest.Builder builder = new SearchRequest.Builder()
                .index("newsdata.newsdata")
                .trackTotalHits(t -> t.enabled(true)); // 전체 검색 결과 수 추적

        String aiSummary = "";
        String originalKeyword = keyword;
        String convertedKeyword = "";

        // 🔍 검색어가 존재할 경우 (AI 요약 및 오타 보정 포함)
        if (keyword != null && !keyword.isBlank()) {
            aiSummary = Gemini(keyword); // Gemini AI 요약 결과 생성

            if (!isResearch) {
                boolean containsHangul = keyword.matches(".*[가-힣]+.*");
                boolean isEnglishOnly = keyword.matches("^[A-Za-z]+$");

                if (!containsHangul && (!isEnglishOnly || keyword.length() >= 4)) {
                    String converted = keyboardMapper.convertEngToKor(keyword);
                    String patched = hangulComposer.combine(converted);
                    log.info("한영키 변환 => {}", converted);
                    log.info("한글 패치 => {}", patched);
                    keyword = patched;
                    convertedKeyword = patched;
                }
            }

            // 형태소 분석 + 조합어 확장
            CharSequence normalized = OpenKoreanTextProcessorJava.normalize(keyword);
            var tokens = OpenKoreanTextProcessorJava.tokenize(normalized);
            List<String> tokenList = OpenKoreanTextProcessorJava.tokensToJavaStringList(tokens);
            List<String> combinedtext = new ArrayList<>(tokenList);

            for (int i = 0, n = tokenList.size(); i < n; i++) {
                int len = 0;
                var sb = new StringBuilder();
                for (int j = i; j < n; j++) {
                    String tok = tokenList.get(j);
                    if (len + tok.length() > 3) break;
                    sb.append(tok);
                    len += tok.length();
                    if (len >= 2) combinedtext.add(sb.toString());
                }
            }

            combinedtext = combinedtext.stream().distinct().toList();
            log.info("검색에 쓰일 단어 => {}", combinedtext);

            //  검색어 기반 BoolQuery 구성
            BoolQuery.Builder boolB = new BoolQuery.Builder();
            for (String term : combinedtext) {
                boolB.should(s -> s.match(m -> m.field("headline").query(term).fuzziness("0").boost(5.0f)));
                boolB.should(s -> s.match(m -> m.field("textrank_keywords").query(term).fuzziness("1").boost(3.0f)));
                boolB.should(s -> s.match(m -> m.field("summary").query(term).fuzziness("1").boost(1.0f)));
                boolB.should(s -> s.match(m -> m.field("content").query(term).fuzziness("1").boost(0.5f)));
            }

            // 카테고리 필터
            if (category != null && !category.isBlank() && !category.equals("전체")) {
                boolB.filter(f -> f.term(t -> t.field("category.keyword").value(category)));
            }

            // 출처 필터
            if (source != null && !source.isBlank()) {
                boolB.filter(f -> f.term(t -> t.field("source.keyword").value(source)));
            }

            builder.query(q -> q.bool(boolB.build()));
        } else {
            //  검색어가 없을 경우: 전체 문서에서 랜덤하게 검색
            builder.query(q -> q
                    .functionScore(fs -> fs
                            .functions(fns -> fns
                                    .randomScore(rs -> rs.seed(String.valueOf(System.nanoTime())))
                            )
                    )
            );

            // 카테고리 필터
            if (category != null && !category.isBlank() && !category.equals("전체")) {
                builder.postFilter(f -> f.term(t -> t.field("category.keyword").value(category)));
            }

            // 출처 필터
            if (source != null && !source.isBlank()) {
                builder.postFilter(f -> f.term(t -> t.field("source.keyword").value(source)));
            }
        }

        // 페이징 처리
        builder.from(page * size).size(size);

        // Elasticsearch 요청 실행
        SearchResponse<Map> resp = client.search(builder.build(), Map.class);
        long totalHits = resp.hits().total() != null ? resp.hits().total().value() : 0;
        int totalPages = (int) Math.ceil((double) totalHits / size);

        // 결과 변환
        List<Map<String, Object>> content = resp.hits().hits().stream().map(hit -> {
            Map<String, Object> map = new HashMap<>(hit.source());
            List<String> combined = new ArrayList<>();
            Object textrank = map.get("textrank_keywords");
            Object tfidf = map.get("tfidf_keywords");
            if (textrank instanceof List<?>) combined.addAll(((List<?>) textrank).stream().map(Object::toString).toList());
            if (tfidf instanceof List<?>) combined.addAll(((List<?>) tfidf).stream().map(Object::toString).toList());
            map.put("keywords", combined.stream().distinct().toList());
            return map;
        }).toList();

        //  null-safe 결과 반환
        return Map.of(
                "content", content,
                "totalElements", totalHits,
                "totalPages", totalPages,
                "currentPage", page,
                "aiSummary", aiSummary != null ? aiSummary : "",
                "originalKeyword", originalKeyword != null ? originalKeyword : "",
                "convertedKeyword", !convertedKeyword.isBlank() ? convertedKeyword : (originalKeyword != null ? originalKeyword : "")
        );
    }



    private String Gemini(String keyword)
    {
        String aiSummary = geminiService.getSummary(keyword);
        log.info("Gemini 요약 결과: {}", aiSummary);
        return aiSummary;
    }

    private double extractScoreFromExplanation(Explanation explanation, String field)
    {
        if (explanation == null) return 0.0;
        double sum = 0.0;
        if (explanation.description() != null && explanation.description().toLowerCase().contains(field))
        {
            sum += explanation.value();
        }
        if (explanation.details() != null)
        {
            for (ExplanationDetail detail : explanation.details())
            {
                sum += extractScoreFromExplanationDetail(detail, field);
            }
        }
        return sum;
    }

    private double extractScoreFromExplanationDetail(ExplanationDetail detail, String field)
    {
        double sum = 0.0;
        if (detail.description() != null && detail.description().toLowerCase().contains(field))
        {
            sum += detail.value();
        }
        if (detail.details() != null)
        {
            for (ExplanationDetail sub : detail.details())
            {
                sum += extractScoreFromExplanationDetail(sub, field);
            }
        }
        return sum;
    }

    public List<String> topKeywords(int size) throws IOException
    {
        SearchRequest req = new SearchRequest.Builder().index("newsdata.newsdata")
                .size(0)
                .query(q -> q.matchAll(m -> m))
                .aggregations("top_keywords", agg -> agg.terms(t -> t.field("textrank_keywords.keyword").size(size)))
                .aggregations("top_tfidf", agg -> agg.terms(t -> t.field("tfidf_keywords.keyword").size(size))).build();

        SearchResponse<Void> res = client.search(req, Void.class);
        Map<String, Long> textrankMap = res.aggregations().get("top_keywords").sterms().buckets().array().stream()
                .collect(Collectors.toMap(b -> b.key().stringValue(), b -> b.docCount()));
        Map<String, Long> tfidfMap = res.aggregations().get("top_tfidf").sterms().buckets().array().stream()
                .collect(Collectors.toMap(b -> b.key().stringValue(), b -> b.docCount()));

        return textrankMap.keySet().stream().filter(tfidfMap::containsKey)
                .sorted(Comparator.comparingLong((String k) -> textrankMap.get(k) + tfidfMap.get(k)).reversed())
                .limit(size).toList();
    }

    public void logPopularNewsAndKeywordsByUrlAndKeywords(String url, List<String> keywords) throws IOException
    {
        log.info("url: {}", url);
        String now = Instant.now().toString();
        try
        {
            client.index(i -> i.index("popular_news_logs").document(Map.of("url", url, "timestamp", now)));
        } catch (Exception e)
        {
            log.error("뉴스 저장 실패: {}", e.getMessage(), e);
        }
        for (String kw : keywords.stream().distinct().toList())
        {
            client.index(i -> i.index("popular_keywords_logs").document(Map.of("keyword", kw, "timestamp", now)));
        }
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void deleteOldClickLogs() throws IOException
    {
        client.deleteByQuery(r -> r.index("popular_keywords_logs").query(q -> q.matchAll(m -> m)));
        client.deleteByQuery(r -> r.index("popular_news_logs").query(q -> q.matchAll(m -> m)));
        log.info("뉴스 및 키워드 자동 삭제 완료");
    }

    public List<String> getTop5NewsUrls() throws IOException
    {
        SearchResponse<Void> response = client.search(
                s -> s.index("popular_news_logs").size(0).aggregations("top_urls",
                        agg -> agg.terms(t -> t.field("url").size(5).order(List.of(NamedValue.of("_count", SortOrder.Desc))))),
                Void.class);
        return response.aggregations().get("top_urls").sterms().buckets().array().stream()
                .map(bucket -> bucket.key().stringValue()).toList();
    }

    public List<Map<String, Object>> getNewsDetail(List<String> urls) throws IOException
    {
        List<Map<String, Object>> result = new ArrayList<>();
        for (String url : urls)
        {
//            SearchResponse<Map> resp = client.search(
//                    s -> s.index("newsdata.newsdata").query(q -> q.term(t -> t.field("url").value(url))).size(1),
//                    Map.class);
            SearchResponse<Map> resp = client.search(
                    s -> s.index("newsdata.newsdata")
                            .query(q -> q.term(t -> t.field("url.keyword").value(url)))  // ✅ 수정
                            .size(1),
                    Map.class
            );
            List<Hit<Map>> hits = resp.hits().hits();
            if (!hits.isEmpty())
            {
                Map src = hits.get(0).source();
                Map<String, Object> news = new HashMap<>();
                news.put("url", url);
                news.put("headline", src.get("headline"));
                news.put("source", src.get("source"));
                result.add(news);
            }
        }
        return result;
    }

    public List<String> getAutocompleteSuggestions(String prefix) throws IOException
    {
        SearchResponse<Void> response = client.search(
                s -> s.index("unique_keywords")
                        .suggest(sg -> sg.suggesters("suggestion",
                                st -> st.prefix(prefix).completion(c -> c.field("keyword_suggest").size(10)))),
                Void.class);

        List<Suggestion<Void>> suggestions = response.suggest().get("suggestion");
        return suggestions.stream().flatMap(suggestion -> suggestion.completion().options().stream())
                .map(CompletionSuggestOption::text).collect(Collectors.toList());
    }
}
