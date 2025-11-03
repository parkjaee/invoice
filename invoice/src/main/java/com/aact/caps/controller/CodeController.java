package com.aact.caps.controller;

import com.aact.caps.dto.CodeDto;
import com.aact.caps.service.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 공통 코드 REST Controller
 */
@RestController
@RequestMapping("/api/caps/codes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CodeController {

    @Autowired
    private CodeService codeService;

    /**
     * 코드 타입별 코드 목록 조회
     * GET /api/caps/codes/{codeType}
     */
    @GetMapping("/{codeType}")
    public ResponseEntity<List<CodeDto>> getCodesByType(@PathVariable String codeType) {
        try {
            List<CodeDto> codes = codeService.getCodesByType(codeType);
            return ResponseEntity.ok(codes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 터미널 코드 목록 조회
     * GET /api/caps/codes/terminals
     */
    @GetMapping("/terminals")
    public ResponseEntity<List<CodeDto>> getTerminals() {
        try {
            List<CodeDto> codes = codeService.getTerminals();
            return ResponseEntity.ok(codes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 부서 코드 목록 조회
     * GET /api/caps/codes/departments
     */
    @GetMapping("/departments")
    public ResponseEntity<List<CodeDto>> getDepartments() {
        try {
            List<CodeDto> codes = codeService.getDepartments();
            return ResponseEntity.ok(codes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 직급 코드 목록 조회
     * GET /api/caps/codes/positions
     */
    @GetMapping("/positions")
    public ResponseEntity<List<CodeDto>> getPositions() {
        try {
            List<CodeDto> codes = codeService.getPositions();
            return ResponseEntity.ok(codes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * CAPS 사용자 목록 조회
     * GET /api/caps/codes/capslist
     */
    @GetMapping("/capslist")
    public ResponseEntity<List<CodeDto>> getCAPSList() {
        try {
            List<CodeDto> codes = codeService.getCAPSList();
            return ResponseEntity.ok(codes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
