package com.aact.invoice.attendance.service;

import com.aact.invoice.attendance.dto.AttendanceRecordDto;
import com.aact.invoice.attendance.repository.mybatis.AttendanceMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 출퇴근 기록 서비스 (MSSQL)
 */
@Service
@Transactional(value = "mssqlTransactionManager", readOnly = true)
public class AttendanceService {

    private final AttendanceMapper attendanceMapper;

    public AttendanceService(AttendanceMapper attendanceMapper) {
        this.attendanceMapper = attendanceMapper;
    }

    /**
     * 사번 리스트로 최신 출퇴근 기록 조회 (날짜별)
     *
     * @param idnoList 사번 리스트 (null이면 모든 사원 조회)
     * @param fromDate 시작 날짜 (YYYY-MM-DD 형식)
     * @param toDate 종료 날짜 (YYYY-MM-DD 형식)
     * @return 사번 -> (날짜 -> AttendanceTimes) 형태의 중첩 Map
     */
    public Map<String, Map<String, AttendanceTimes>> getLatestAttendanceMap(List<String> idnoList, String fromDate, String toDate) {
        // 날짜 형식 변환: YYYY-MM-DD -> YYYYMMDD
        String formattedFromDate = formatDateForMssql(fromDate);
        String formattedToDate = formatDateForMssql(toDate);

        // idnoList가 null이거나 비어있으면 모든 사원의 출퇴근 기록 조회
        List<AttendanceRecordDto> records = attendanceMapper.getLatestAttendanceByIdnoList(
                idnoList,
                formattedFromDate,
                formattedToDate
        );

        // 사번 -> (날짜 -> 출근/퇴근 시간) 형태의 중첩 Map 생성
        Map<String, Map<String, AttendanceTimes>> attendanceMap = new HashMap<>();

        for (AttendanceRecordDto record : records) {
            String idno = record.getIdno();
            String date = record.geteDate();  // YYYYMMDD 형식
            String dateTime = record.geteDateTime();
            Integer mode = record.geteMode();

            // 사번에 해당하는 Map이 없으면 생성
            attendanceMap.putIfAbsent(idno, new HashMap<>());
            Map<String, AttendanceTimes> dateMap = attendanceMap.get(idno);

            // 날짜에 해당하는 AttendanceTimes 객체가 없으면 생성
            dateMap.putIfAbsent(date, new AttendanceTimes());
            AttendanceTimes times = dateMap.get(date);

            // e_mode로 출근/퇴근 구분
            if (mode != null && mode == 1) {
                times.setCheckinTime(dateTime != null ? dateTime : "");
            } else if (mode != null && mode == 2) {
                times.setCheckoutTime(dateTime != null ? dateTime : "");
            }
        }

        return attendanceMap;
    }

    /**
     * 날짜 형식 변환: YYYY-MM-DD -> YYYYMMDD
     *
     * @param date YYYY-MM-DD 형식의 날짜 문자열
     * @return YYYYMMDD 형식의 날짜 문자열
     */
    private String formatDateForMssql(String date) {
        if (date == null || date.isEmpty()) {
            return "";
        }
        // "-" 제거
        return date.replace("-", "");
    }

    /**
     * 출퇴근 시간을 담는 클래스
     */
    public static class AttendanceTimes {
        private String checkinTime = "";   // 출근 시간
        private String checkoutTime = "";  // 퇴근 시간

        public String getCheckinTime() {
            return checkinTime;
        }

        public void setCheckinTime(String checkinTime) {
            this.checkinTime = checkinTime;
        }

        public String getCheckoutTime() {
            return checkoutTime;
        }

        public void setCheckoutTime(String checkoutTime) {
            this.checkoutTime = checkoutTime;
        }
    }
}
