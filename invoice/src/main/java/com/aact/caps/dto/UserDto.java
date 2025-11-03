package com.aact.caps.dto;

/**
 * CAPS 사용자 DTO
 */
public class UserDto {
    private Long userSid;
    private String userId;
    private String userName1;
    private String userName2;
    private String capsId;
    private String companyCode;
    private String branchCode;
    private String departmentCode;
    private String positionCode;
    private String terminalCodeWork;
    private String terminalNameWork;

    // Constructors
    public UserDto() {
    }

    // Getters and Setters
    public Long getUserSid() {
        return userSid;
    }

    public void setUserSid(Long userSid) {
        this.userSid = userSid;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName1() {
        return userName1;
    }

    public void setUserName1(String userName1) {
        this.userName1 = userName1;
    }

    public String getUserName2() {
        return userName2;
    }

    public void setUserName2(String userName2) {
        this.userName2 = userName2;
    }

    public String getCapsId() {
        return capsId;
    }

    public void setCapsId(String capsId) {
        this.capsId = capsId;
    }

    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void setBranchCode(String branchCode) {
        this.branchCode = branchCode;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getPositionCode() {
        return positionCode;
    }

    public void setPositionCode(String positionCode) {
        this.positionCode = positionCode;
    }

    public String getTerminalCodeWork() {
        return terminalCodeWork;
    }

    public void setTerminalCodeWork(String terminalCodeWork) {
        this.terminalCodeWork = terminalCodeWork;
    }

    public String getTerminalNameWork() {
        return terminalNameWork;
    }

    public void setTerminalNameWork(String terminalNameWork) {
        this.terminalNameWork = terminalNameWork;
    }
}
