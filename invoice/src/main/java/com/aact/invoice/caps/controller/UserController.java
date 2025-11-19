package com.aact.invoice.caps.controller;

import com.aact.invoice.caps.dto.UserDto;
import com.aact.invoice.caps.dto.request.UserSearchRequest;
import com.aact.invoice.caps.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CAPS 사용자 관리 REST Controller
 */
@RestController
@RequestMapping("/api/caps/users")
@CrossOrigin(origins = {"http://localhost:5174", "http://localhost:3000", "http://192.168.200.152:8080"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 사용자 목록 조회
     * GET /api/caps/users?userId=xxx&userName=xxx&fromDate=xxx&toDate=xxx&showAttended=true&showNotAttended=true
     */
    @GetMapping
    public List<UserDto> getUsers(@ModelAttribute UserSearchRequest request) {
        return userService.listUsers(request);
    }
}
