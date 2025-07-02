package com.boot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AutocompleteDTO {
	private String query;
	private Integer count;

	// 카운트 없이 검색어만 저장하는 생성자
	public AutocompleteDTO(String query) {
		this.query = query;
		this.count = null;
	}
}