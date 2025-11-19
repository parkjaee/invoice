package com.aact.invoice.caps.service;

import com.aact.invoice.attendance.repository.mybatis.UserInfoMapper;
import com.aact.invoice.attendance.service.AttendanceService;
import com.aact.invoice.caps.dto.UserDto;
import com.aact.invoice.caps.dto.request.UserSearchRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * CAPS 사용자 서비스
 */

@Service
public class UserService {

    private final UserInfoMapper userInfoMapper;
    private final AttendanceService attendanceService;

    public UserService(UserInfoMapper userInfoMapper, AttendanceService attendanceService) {
        this.userInfoMapper = userInfoMapper;
        this.attendanceService = attendanceService;
    }

    @Transactional(readOnly = true)
    public List<UserDto> listUsers(UserSearchRequest req) {
        // 1단계: MSSQL에서 모든 사용자 정보 조회
        Map<String, Object> p = new HashMap<>();

        List<UserDto> allUsers = userInfoMapper.callGetUsers(p);

        System.out.println("=== 1단계: MSSQL 조회 결과 ===");
        System.out.println("전체 사용자 수: " + allUsers.size());
        // 처음 3명 샘플 출력
        allUsers.stream().limit(3).forEach(u ->
            System.out.println("  - " + u.getUserId() + " / " + u.getUserName() + " / " + u.getDepartmentName() + " / " + u.getPositionName())
        );

        // 2단계: 이름/사번 검색 필터 먼저 적용
        List<UserDto> filteredUsers = new java.util.ArrayList<>();
        for (UserDto user : allUsers) {
            String userId = user.getUserId();
            String userName = user.getUserName() != null ? user.getUserName() : "";

            // 사용자 이름/사번 검색 필터 적용
            boolean matchesFilter = true;
            if (req.userId() != null && !req.userId().trim().isEmpty()) {
                if (!userId.contains(req.userId().trim())) {
                    matchesFilter = false;
                }
            }
            if (req.userName() != null && !req.userName().trim().isEmpty()) {
                if (!userName.contains(req.userName().trim())) {
                    matchesFilter = false;
                }
            }

            if (matchesFilter) {
                filteredUsers.add(user);
            }
        }

        System.out.println("=== 2단계: 검색 필터 적용 ===");
        System.out.println("필터 적용 후 사용자 수: " + filteredUsers.size());

        if (filteredUsers.isEmpty()) {
            System.out.println("검색 조건에 맞는 사용자가 없습니다.");
            return List.of();
        }

        // 3단계: 필터링된 사용자의 사번으로 MSSQL 출퇴근 기록 조회
        List<String> idnoList = filteredUsers.stream()
                .map(UserDto::getUserId)
                .filter(id -> id != null && !id.isEmpty())
                .collect(Collectors.toList());

        System.out.println("=== 3단계: 출퇴근 기록 조회 ===");
        Map<String, Map<String, AttendanceService.AttendanceTimes>> attendanceMap;
        try {
            attendanceMap = attendanceService.getLatestAttendanceMap(idnoList, req.fromDate(), req.toDate());
            System.out.println("출퇴근 기록이 있는 사원 수: " + attendanceMap.size());
        } catch (Exception e) {
            System.err.println("출퇴근 기록 조회 실패: " + e.getMessage());
            e.printStackTrace();
            attendanceMap = new HashMap<>();
        }

        System.out.println("=== 4단계: 날짜별 행 확장 ===");
        // 기본값 설정
        boolean showAttended = req.showAttended() != null ? req.showAttended() : true;
        boolean showNotAttended = req.showNotAttended() != null ? req.showNotAttended() : true;
        System.out.println("출근 표시: " + showAttended + ", 미출근 표시: " + showNotAttended);

        List<UserDto> expandedRows = new java.util.ArrayList<>();

        for (UserDto user : filteredUsers) {
            String userId = user.getUserId();

            // 출퇴근 기록 확인
            Map<String, AttendanceService.AttendanceTimes> dateMap = attendanceMap.get(userId);
            boolean hasAttendance = (dateMap != null && !dateMap.isEmpty());

            if (hasAttendance) {
                // 출퇴근 기록이 있는 경우
                if (!showAttended) {
                    continue;  // 출근한 사람 표시 안함
                }

                // 날짜별로 복제
                for (Map.Entry<String, AttendanceService.AttendanceTimes> entry : dateMap.entrySet()) {
                    String date = entry.getKey();  // YYYYMMDD
                    AttendanceService.AttendanceTimes times = entry.getValue();

                    UserDto clonedUser = cloneUser(user);
                    clonedUser.setAttendanceDate(date);
                    clonedUser.setUserCheckin(times.getCheckinTime());
                    clonedUser.setUserCheckout(times.getCheckoutTime());

                    expandedRows.add(clonedUser);
                }
            } else {
                // 출퇴근 기록이 없는 경우
                if (!showNotAttended) {
                    continue;  // 미출근한 사람 표시 안함
                }

                // 날짜 없이 한 행 추가
                UserDto clonedUser = cloneUser(user);
                clonedUser.setAttendanceDate("");
                clonedUser.setUserCheckin("");
                clonedUser.setUserCheckout("");
                expandedRows.add(clonedUser);
            }
        }

        // 5단계: 날짜 내림차순, 사번 오름차순 정렬
        expandedRows.sort((a, b) -> {
            String dateA = a.getAttendanceDate() != null ? a.getAttendanceDate() : "";
            String dateB = b.getAttendanceDate() != null ? b.getAttendanceDate() : "";
            int dateCompare = dateA.compareTo(dateB);  // 날짜 내림차순

            if (dateCompare != 0) {
                return dateCompare;
            }

            String idA = a.getUserId() != null ? a.getUserId() : "";
            String idB = b.getUserId() != null ? b.getUserId() : "";
            return idA.compareTo(idB);  // 사번 오름차순
        });

        System.out.println("=== 5단계: 최종 결과 ===");
        System.out.println("최종 결과 행 수: " + expandedRows.size());
        System.out.println("(사용자 " + filteredUsers.size() + "명 → 날짜별 확장 → " + expandedRows.size() + "행)");

        return expandedRows;
    }

    /**
     * UserDto 객체 복제
     */
    private UserDto cloneUser(UserDto source) {
        UserDto cloned = new UserDto();
        cloned.setUserSid(source.getUserSid());
        cloned.setUserId(source.getUserId());
        cloned.setUserName(source.getUserName());
        cloned.setDepartmentCode(source.getDepartmentCode());
        cloned.setDepartmentName(source.getDepartmentName());
        cloned.setPositionCode(source.getPositionCode());
        cloned.setPositionName(source.getPositionName());
        return cloned;
    }
}
