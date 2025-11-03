package com.aact.caps.service;

import com.aact.caps.dto.UserDto;
import com.aact.caps.entity.User;
import com.aact.caps.repository.jpa.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * CAPS 사용자 서비스
 */
@Service
@Transactional(readOnly = true)
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * 사용자 목록 조회
     */
    public List<UserDto> getUsers(String terminalCode, String fromDate, String toDate) {
        List<User> users;

        if (terminalCode != null && !terminalCode.isEmpty() && !"ALL".equals(terminalCode)) {
            users = userRepository.findUsersByCondition(terminalCode);
        } else {
            users = userRepository.findAllOrderedUsers();
        }

        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 사용자 정보 수정 (일괄)
     */
    @Transactional
    public void updateUsers(List<UserDto> userDtos, String updateUser, String updateIp) {
        for (UserDto dto : userDtos) {
            User user = userRepository.findByUserId(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + dto.getUserId()));

            // 수정 가능한 필드만 업데이트
            user.setUserName2(dto.getUserName2());
            user.setCapsId(dto.getCapsId());
            user.setDepartmentCode(dto.getDepartmentCode());
            user.setPositionCode(dto.getPositionCode());
            user.setUpdateDate(LocalDateTime.now());
            user.setUpdateUser(updateUser);

            userRepository.save(user);
        }
    }

    /**
     * 단일 사용자 정보 수정
     */
    @Transactional
    public UserDto updateUser(String userId, UserDto userDto, String updateUser, String updateIp) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));

        // 수정 가능한 필드만 업데이트
        user.setUserName2(userDto.getUserName2());
        user.setCapsId(userDto.getCapsId());
        user.setDepartmentCode(userDto.getDepartmentCode());
        user.setPositionCode(userDto.getPositionCode());
        user.setUpdateDate(LocalDateTime.now());
        user.setUpdateUser(updateUser);

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    /**
     * 사용자 삭제 (일괄)
     */
    @Transactional
    public void deleteUsers(List<String> userIds) {
        for (String userId : userIds) {
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
            userRepository.delete(user);
        }
    }

    /**
     * Entity를 DTO로 변환
     */
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        BeanUtils.copyProperties(user, dto);
        return dto;
    }

    /**
     * DTO를 Entity로 변환
     */
    private User convertToEntity(UserDto dto) {
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        return user;
    }
}
