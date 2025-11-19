package com.aact.caps.controller;

import com.aact.caps.dto.ProcResult;
import com.aact.caps.dto.UserDto;
import com.aact.caps.dto.request.RequestMeta;
import com.aact.caps.dto.request.UserSearchRequest;
import com.aact.caps.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * CAPS 사용자 관리 REST Controller
 */
@RestController
@RequestMapping("/api/caps/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 사용자 목록 조회
     * GET /api/caps/users?terminalCode=xxx&fromDate=xxx&toDate=xxx
     */
    @GetMapping
    public ResponseEntity<List<UserDto>> getUsers(
            @RequestParam(required = false) String terminalCode,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            HttpServletRequest request) {
        try {
            // UserSearchRequest 생성
            UserSearchRequest searchRequest = new UserSearchRequest(
                                    null,
                                    null,
                                  null,
                                    null,
                                          null,
                                        null,
                                        null,
                                      "KOR"

            );

            // RequestMeta 생성
            RequestMeta meta = new RequestMeta(
                    "SYSTEM",
                    request.getRemoteAddr(),
                    "TEST",
                    UUID.randomUUID().toString()
            );

            // 서비스 호출
            ProcResult<List<UserDto>> result = userService.listUsers(searchRequest, meta);

            // 결과 반환
            return ResponseEntity.ok(result.data());
        } catch (UserService.ProcCallException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
