package com.aact.invoice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web 설정 클래스
 * - CORS (Cross-Origin Resource Sharing) 설정
 * - React 프론트엔드와 Spring Boot 백엔드 간 통신 허용
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // /api로 시작하는 모든 경로에 CORS 허용
                .allowedOrigins(
                        "http://localhost:5173",    // React 개발 서버
                        "http://localhost:3000",
                        "http://192.168.200.152:8080"// React 대체 포트
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);  // preflight 요청 캐시 시간 (1시간)
    }
}
