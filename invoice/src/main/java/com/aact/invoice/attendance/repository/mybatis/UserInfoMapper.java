package com.aact.invoice.attendance.repository.mybatis;

import com.aact.invoice.caps.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * 사용자 정보 Mybatis Mapper (MSSQL DB 연결)
 * tuser, nPart, nPosition 테이블 조회
 */
@Mapper
public interface UserInfoMapper {
    // 사용자 목록 조회 (JOIN 쿼리)
    List<UserDto> callGetUsers(Map<String, Object> params);
}
