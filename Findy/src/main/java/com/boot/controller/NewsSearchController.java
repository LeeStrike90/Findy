package com.boot.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boot.dto.ClickRequest;
import com.boot.service.ElasticService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class NewsSearchController
{

    private final ElasticService elasticService;

    public NewsSearchController(ElasticService elasticService)
    {
        this.elasticService = elasticService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchNews(@RequestParam(value = "q", required = false) String keyword,
                                        @RequestParam(value = "category", required = false) String category,
                                        @RequestParam(value = "page", defaultValue = "0") int page,
                                        @RequestParam(value = "size", defaultValue = "10") int size,
                                        @RequestParam(value = "source", required = false) String source,  //
                                        @RequestParam(value = "research", defaultValue = "false") boolean isResearch) throws IOException
    {

        log.info("!@#$@!#$" + category);

        log.info(" 검색 요청: keyword={}, category={}, page={}, size={}, research={},source={}", keyword, category, page, size,
                isResearch,source);


        // ElasticService에서 뉴스 검색 결과 가져오기
        Map<String, Object> result = elasticService.searchWithPagination(keyword, category, source, page, size, isResearch);

        // 최종 JSON 응답 반환
        return ResponseEntity.ok(result);
    }

    // test용
    @GetMapping("/keywordRank")
    public List<String> topKeywords(@RequestParam(value = "size") int size) throws IOException
    {

        return elasticService.topKeywords(size);
    }

    // 뉴스 선택시 카운트 +1
    @PostMapping("/news/click")
    public void recordClick(@RequestBody ClickRequest request) throws IOException
    {
        log.info("recordClick()");
//		log.info("클릭 요청 수신 => url={}, keywords={}", request.getUrl(), request.getKeywords());
        elasticService.logPopularNewsAndKeywordsByUrlAndKeywords(request.getUrl(), request.getKeywords());
    }

    // url top5
    @GetMapping("/news/top5")
    public ResponseEntity<?> getTop5Urls() throws IOException
    {
        List<String> urls = elasticService.getTop5NewsUrls();
        List<Map<String, Object>> detailedNews = elasticService.getNewsDetail(urls);
        log.info("detailedNews => {}", detailedNews);
        return ResponseEntity.ok(detailedNews);
    }

    // 자동완성
    @GetMapping("/autocomplete")
    public List<String> autocomplete(@RequestParam("q") String prefix) throws IOException
    {
        log.info("!@#${}", elasticService.getAutocompleteSuggestions(prefix));
        return elasticService.getAutocompleteSuggestions(prefix);
    }
}