package com.aact.invoice.attendance.dto;

/**
 * 출퇴근 기록 DTO
 * MSSQL 테이블: tuser + tenter 조인
 */
public class AttendanceRecordDto {

    private String idno;           // 사번 (tuser.idno)
    private String name;           // 이름 (tuser.name)
    private String eDate;          // 날짜 (e_date, YYYYMMDD 형식)
    private String eDateTime;      // 날짜+시간 (e_date + e_time 합친 값)
    private Integer eMode;         // 구분 (1=출근, 2=퇴근)

    // Constructors
    public AttendanceRecordDto() {
    }

    public AttendanceRecordDto(String idno, String name, String eDate, String eDateTime, Integer eMode) {
        this.idno = idno;
        this.name = name;
        this.eDate = eDate;
        this.eDateTime = eDateTime;
        this.eMode = eMode;
    }

    // Getters and Setters
    public String getIdno() {
        return idno;
    }

    public void setIdno(String idno) {
        this.idno = idno;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String geteDate() {
        return eDate;
    }

    public void seteDate(String eDate) {
        this.eDate = eDate;
    }

    public String geteDateTime() {
        return eDateTime;
    }

    public void seteDateTime(String eDateTime) {
        this.eDateTime = eDateTime;
    }

    public Integer geteMode() {
        return eMode;
    }

    public void seteMode(Integer eMode) {
        this.eMode = eMode;
    }

    @Override
    public String toString() {
        return "AttendanceRecordDto{" +
                "idno='" + idno + '\'' +
                ", name='" + name + '\'' +
                ", eDate='" + eDate + '\'' +
                ", eDateTime='" + eDateTime + '\'' +
                ", eMode=" + eMode +
                '}';
    }
}
