package com.aact.invoice.caps.controller;

import com.aact.invoice.caps.dto.CodeDto;
import com.aact.invoice.caps.dto.ProcResult;
import com.aact.invoice.caps.dto.request.RequestMeta;
import com.aact.invoice.caps.service.CodeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * 코드 관리 REST API
 */
@RestController
@RequestMapping("/api/caps/codes")
@CrossOrigin(origins = {"http://localhost:5174", "http://localhost:3000","http://192.168.200.152:8080"})
public class CodeController {

    private final CodeService codeService;

    public CodeController(CodeService codeService) {
        this.codeService = codeService;
    }

    /**
     * 터미널 코드 조회 (프로시저 사용)
     * GET /api/caps/codes/terminals
     */
    @GetMapping("/terminals")
    public ResponseEntity<List<CodeDto>> getTerminals(HttpServletRequest request) {
        RequestMeta meta = new RequestMeta(
                "SYSTEM",
                request.getRemoteAddr(),
                "CODE_API",
                UUID.randomUUID().toString()
        );
        ProcResult<List<CodeDto>> result = codeService.getTerminals(meta);
        return ResponseEntity.ok(result.data());
    }

    // 부서/직급 코드는 사용자 조회 시 JOIN으로 가져오므로 엔드포인트 제거됨
    // /departments, /positions, /capsids 제거

    /**
     * 범용 코드 조회 (코드 타입 지정)
     * GET /api/caps/codes?type=TRMCD
     */
    @GetMapping
    public ResponseEntity<List<CodeDto>> getCodes(
            @RequestParam String type,
            @RequestParam(required = false, defaultValue = "") String code,
            HttpServletRequest request) {
        RequestMeta meta = new RequestMeta(
                "SYSTEM",
                request.getRemoteAddr(),
                "CODE_API",
                UUID.randomUUID().toString()
        );
        ProcResult<List<CodeDto>> result = codeService.getCodes(type, code, meta);
        return ResponseEntity.ok(result.data());
    }
}
