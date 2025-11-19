package com.aact.invoice.caps.dto;

/**
 * CAPS 사용자 DTO
 */
public class UserDto {
    //사용자 기본 정보
    private Long   userSid;
    private String userId;
    private String userName;

    //조직 정보
    private String departmentCode;
    private String departmentName;
    private String positionCode;
    private String positionName;

    // MSSQL 출퇴근 기록 (런타임에 추가됨)
    private String attendanceDate;  // 출퇴근 날짜 (YYYYMMDD 형식)
    private String userCheckin;     // 출근 시간
    private String userCheckout;    // 퇴근 시간

    // Constructors
    public UserDto() {
    }

    public Long getUserSid() {
        return userSid;
    }

    public void setUserSid(Long userSid) {
        this.userSid = userSid;
    }

    //getter 및 setter
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getPositionCode() {
        return positionCode;
    }

    public void setPositionCode(String positionCode) {
        this.positionCode = positionCode;
    }

    public String getPositionName() {
        return positionName;
    }

    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    public String getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(String attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public String getUserCheckin() {
        return userCheckin;
    }

    public void setUserCheckin(String userCheckin) {
        this.userCheckin = userCheckin;
    }

    public String getUserCheckout() {
        return userCheckout;
    }

    public void setUserCheckout(String userCheckout) {
        this.userCheckout = userCheckout;
    }
}
