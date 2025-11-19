/**
 * CAPS (Cargo Acceptance System) 패키지
 *
 * - 화물 수용 시스템 관련 기능
 * - Invoice 프로젝트 내 별도 모듈로 구성
 * - CAPS DB 연동 및 비즈니스 로직 처리
 *
 * 구조:
 * - controller: REST API 엔드포인트
 * - service: 비즈니스 로직
 * - repository: 데이터 접근 계층 (JPA + MyBatis)
 * - entity: JPA 엔티티
 * - dto: 데이터 전송 객체
 * - config: CAPS 전용 설정
 * - exception: 예외 처리
 * - util: 유틸리티
 */
package com.aact.invoice.caps;
