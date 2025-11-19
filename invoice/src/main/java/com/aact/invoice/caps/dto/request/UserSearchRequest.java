package com.aact.invoice.caps.dto.request;

/**
 * 사용자 검색 요청 DTO
 */
public record UserSearchRequest(
        String userId,          // 사번 검색
        String userName,        // 이름 검색
        String fromDate,        // 조회 시작 날짜 (YYYY-MM-DD)
        String toDate,          // 조회 종료 날짜 (YYYY-MM-DD)
        Boolean showAttended,   // 출근한 사람 표시 여부 (default: true)
        Boolean showNotAttended // 미출근한 사람 표시 여부 (default: true)
) {}
