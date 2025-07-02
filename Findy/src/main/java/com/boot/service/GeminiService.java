package com.boot.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {

	@Value("${gemini.api.key}")
	private String apiKey;

	private final RestTemplate restTemplate = new RestTemplate();

	public String getSummary(String query) {
		System.out.println(" getSummary 시작");

		try {

			String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
					+ apiKey;

			Map<String, Object> body = Map.of("contents",
					List.of(Map.of("parts", List.of(Map.of("text", query + "에 대해 간단히 요약해줘")))));

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

			ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

			System.out.println(" Gemini API 응답: " + response.getBody());

			Map<String, Object> responseBody = response.getBody();
			if (responseBody == null || !responseBody.containsKey("candidates")) {
				return "AI 응답 형식이 예상과 다릅니다.";
			}

			var candidates = (List<Map<String, Object>>) responseBody.get("candidates");
			if (candidates.isEmpty()) {
				return "AI 요약 결과가 없습니다.";
			}

			var content = (Map<String, Object>) candidates.get(0).get("content");
			var parts = (List<Map<String, Object>>) content.get("parts");
			if (parts.isEmpty()) {
				return "AI 요약 결과가 없습니다.";
			}

			return parts.get(0).get("text").toString();

		} catch (Exception e) {
			System.err.println(" Gemini API 호출 중 예외 발생:");
			e.printStackTrace();
			return "AI 요약을 가져오는 데 실패했습니다.";
		}
	}
}
