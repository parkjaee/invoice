package com.aact.caps.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * CAPS 사용자 엔티티
 * 테이블: CM_USER (또는 해당 사용자 테이블)
 */
@Entity
@Table(name = "CM_USER")
public class User {

    @Id
    @Column(name = "USER_SID")
    private Long userSid;

    @Column(name = "USER_ID", nullable = false, length = 50)
    private String userId;

    @Column(name = "USER_NAME1", length = 100)
    private String userName1;  // 한글명

    @Column(name = "USER_NAME2", length = 100)
    private String userName2;  // 영문명

    @Column(name = "CAPS_ID", length = 50)
    private String capsId;

    @Column(name = "COMPANY_CODE", length = 20)
    private String companyCode;

    @Column(name = "BRANCH_CODE", length = 20)
    private String branchCode;

    @Column(name = "DEPARTMENT_CODE", length = 20)
    private String departmentCode;

    @Column(name = "POSITION_CODE", length = 20)
    private String positionCode;

    @Column(name = "TERMINAL_CODE_WORK", length = 20)
    private String terminalCodeWork;

    @Column(name = "TERMINAL_NAME_WORK", length = 100)
    private String terminalNameWork;

    @Column(name = "INSERT_DATE")
    private LocalDateTime insertDate;

    @Column(name = "INSERT_USER", length = 50)
    private String insertUser;

    @Column(name = "UPDATE_DATE")
    private LocalDateTime updateDate;

    @Column(name = "UPDATE_USER", length = 50)
    private String updateUser;

    // Constructors
    public User() {
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

    public LocalDateTime getInsertDate() {
        return insertDate;
    }

    public void setInsertDate(LocalDateTime insertDate) {
        this.insertDate = insertDate;
    }

    public String getInsertUser() {
        return insertUser;
    }

    public void setInsertUser(String insertUser) {
        this.insertUser = insertUser;
    }

    public LocalDateTime getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser;
    }
}
