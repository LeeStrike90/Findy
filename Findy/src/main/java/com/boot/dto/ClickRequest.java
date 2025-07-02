package com.boot.dto;

import java.util.List;

import lombok.Data;

@Data
public class ClickRequest {
	private String url;
	private List<String> keywords;
}