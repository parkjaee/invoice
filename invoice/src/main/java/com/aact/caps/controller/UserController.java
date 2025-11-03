package com.aact.caps.controller;

import com.aact.caps.dto.UserDto;
import com.aact.caps.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
            @RequestParam(required = false) String toDate) {
        try {
            List<UserDto> users = userService.getUsers(terminalCode, fromDate, toDate);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 사용자 정보 수정 (일괄)
     * PUT /api/caps/users/batch
     */
    @PutMapping("/batch")
    public ResponseEntity<Map<String, Object>> updateUsers(
            @RequestBody List<UserDto> users,
            HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: 실제 사용자 정보 가져오기 (현재는 임시)
            String updateUser = "ADMIN";
            String updateIp = request.getRemoteAddr();

            userService.updateUsers(users, updateUser, updateIp);

            response.put("success", true);
            response.put("message", "저장되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "저장 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 단일 사용자 정보 수정
     * PUT /api/caps/users/{userId}
     */
    @PutMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable String userId,
            @RequestBody UserDto userDto,
            HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String updateUser = "ADMIN";
            String updateIp = request.getRemoteAddr();

            UserDto updated = userService.updateUser(userId, userDto, updateUser, updateIp);

            response.put("success", true);
            response.put("message", "수정되었습니다.");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "수정 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 사용자 삭제 (일괄)
     * DELETE /api/caps/users
     */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteUsers(@RequestBody Map<String, List<String>> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<String> userIds = request.get("userIds");
            userService.deleteUsers(userIds);

            response.put("success", true);
            response.put("message", "삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "삭제 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
