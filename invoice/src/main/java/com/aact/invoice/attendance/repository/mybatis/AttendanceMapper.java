package com.aact.invoice.attendance.repository.mybatis;

import com.aact.invoice.attendance.dto.AttendanceRecordDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AttendanceMapper {

    /**
     * 특정 사번 리스트의 최신 출퇴근 기록 조회
     * CAPS에서 조회된 사번만 MSSQL에서 조회
     *
     * @param idnoList 사번 리스트
     * @param fromDate 시작 날짜 (YYYYMMDD 형식)
     * @param toDate 종료 날짜 (YYYYMMDD 형식)
     * @return 출퇴근 기록 목록
     */
    List<AttendanceRecordDto> getLatestAttendanceByIdnoList(
            @Param("idnoList") List<String> idnoList,
            @Param("fromDate") String fromDate,
            @Param("toDate") String toDate
    );
}
