package com.aact.caps.service;

import com.aact.caps.dto.ProcResult;
import com.aact.caps.dto.UserDto;
import com.aact.caps.dto.request.RequestMeta;
import com.aact.caps.dto.request.UserSearchRequest;
import com.aact.caps.entity.User;
import com.aact.caps.repository.jpa.UserRepository;
import com.aact.caps.repository.mybatis.userInfoMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * CAPS 사용자 서비스
 */

@Service
public class UserService {

    private final userInfoMapper userInfoMapper;

    public UserService(userInfoMapper userInfoMapper) {
        this.userInfoMapper = userInfoMapper;
    }

    @Transactional(readOnly = true)
    public ProcResult<List<UserDto>> listUsers(UserSearchRequest req, RequestMeta meta) {
        Map<String, Object> p = new HashMap<>();

        // IN 파라미터
        p.put("I_COMPANY_CODE",         req.companyCode());
        p.put("I_BRANCH_CODE",         req.branchCode());
        p.put("I_DEPARTMENT_CODE",         req.departmentCode());
        p.put("I_POSITION_CODE",         req.positionCode());
        p.put("I_USER_ID",         req.userId());
        p.put("I_USER_NAME",         req.userName());
        p.put("I_USABLE_FLAG",         req.usableFlag());
        p.put("I_LANGUAGE_CODE",         "KOR");
        p.put("I_PROGRESS_GUID",         meta.progressGuid());
        p.put("I_REQUEST_USER_ID",         meta.requestUserId());
        p.put("I_REQUEST_IP_ADDRESS",         meta.requestIp());
        p.put("I_REQUEST_PROGRAM_ID",         meta.programId());

        // CALL
        userInfoMapper.callGetUsers(p);

        // OUT
        String err = (String) p.get("O_ERROR_FLAG");
        String code = (String) p.get("O_RETURN_CODE");
        String msg = (String) p.get("O_RETURN_MSG");


        @SuppressWarnings("unchecked")
        List<UserDto> rows = (List<UserDto>) p.getOrDefault("O_RESULT_CURSOR",List.of());

        if ("Y".equalsIgnoreCase(err)) {
            throw new ProcCallException(code, msg);
        }
        return new ProcResult<>(rows, code, msg, false);
    }


    public static class ProcCallException extends RuntimeException {
        private final String code;
        public ProcCallException(String code, String message) { super(message); this.code = code;}
        public String getCode() { return code; }
    }


}







//@Service
//@Transactional(readOnly = true)
//public class UserService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    /**
//     * 사용자 목록 조회
//     */
//    public List<UserDto> getUsers(String terminalCode, String fromDate, String toDate) {
//        List<User> users;
//
//        if (terminalCode != null && !terminalCode.isEmpty() && !"ALL".equals(terminalCode)) {
//            users = userRepository.findUsersByCondition(terminalCode);
//        } else {
//            users = userRepository.findAllOrderedUsers();
//        }
//
//        return users.stream()
//                .map(this::convertToDto)
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * 사용자 정보 수정 (일괄)
//     */
//    @Transactional
//    public void updateUsers(List<UserDto> userDtos, String updateUser, String updateIp) {
//        for (UserDto dto : userDtos) {
//            User user = userRepository.findByUserId(dto.getUserId())
//                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + dto.getUserId()));
//
//            // 수정 가능한 필드만 업데이트
//            user.setUserName2(dto.getUserName2());
//            user.setCapsId(dto.getCapsId());
//            user.setDepartmentCode(dto.getDepartmentCode());
//            user.setPositionCode(dto.getPositionCode());
//            user.setUpdateDate(LocalDateTime.now());
//            user.setUpdateUser(updateUser);
//
//            userRepository.save(user);
//        }
//    }
//
//    /**
//     * 단일 사용자 정보 수정
//     */
//    @Transactional
//    public UserDto updateUser(String userId, UserDto userDto, String updateUser, String updateIp) {
//        User user = userRepository.findByUserId(userId)
//                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
//
//        // 수정 가능한 필드만 업데이트
//        user.setUserName2(userDto.getUserName2());
//        user.setCapsId(userDto.getCapsId());
//        user.setDepartmentCode(userDto.getDepartmentCode());
//        user.setPositionCode(userDto.getPositionCode());
//        user.setUpdateDate(LocalDateTime.now());
//        user.setUpdateUser(updateUser);
//
//        User savedUser = userRepository.save(user);
//        return convertToDto(savedUser);
//    }
//
//    /**
//     * 사용자 삭제 (일괄)
//     */
//    @Transactional
//    public void deleteUsers(List<String> userIds) {
//        for (String userId : userIds) {
//            User user = userRepository.findByUserId(userId)
//                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
//            userRepository.delete(user);
//        }
//    }
//
//    /**
//     * Entity를 DTO로 변환
//     */
//    private UserDto convertToDto(User user) {
//        UserDto dto = new UserDto();
//        BeanUtils.copyProperties(user, dto);
//        return dto;
//    }
//
//    /**
//     * DTO를 Entity로 변환
//     */
//    private User convertToEntity(UserDto dto) {
//        User user = new User();
//        BeanUtils.copyProperties(dto, user);
//        return user;
//    }
//}
