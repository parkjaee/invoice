package com.aact.caps.dto;

/**
 * CAPS 사용자 DTO
 */
public class UserDto {
    private Long userSid;
    private String userId;
    private String userName1;
    private String userName2;
    private String companyCode;
    private String branchCode;
    private String departmentCode;
    private String positionCode;
    private String companyName;
    private String branchName;
    private String departmentName;
    private String positionName;
    private String capsId;
    private String terminalCodeWork;
    private String terminalNameWork;
    private String usableFlag;
    private String retireFlag;
    private String createdUserName;
    private String createdTime;
    private String updatedUserName;
    private String updatedTime;

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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getPositionName() {
        return positionName;
    }

    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    public String getUsableFlag() {
        return usableFlag;
    }

    public void setUsableFlag(String usableFlag) {
        this.usableFlag = usableFlag;
    }

    public String getRetireFlag() {
        return retireFlag;
    }

    public void setRetireFlag(String retireFlag) {
        this.retireFlag = retireFlag;
    }

    public String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(String createdUserName) {
        this.createdUserName = createdUserName;
    }

    public String getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(String createdTime) {
        this.createdTime = createdTime;
    }

    public String getUpdatedUserName() {
        return updatedUserName;
    }

    public void setUpdatedUserName(String updatedUserName) {
        this.updatedUserName = updatedUserName;
    }

    public String getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(String updatedTime) {
        this.updatedTime = updatedTime;
    }
}
