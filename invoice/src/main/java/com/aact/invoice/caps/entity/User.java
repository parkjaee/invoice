package com.aact.invoice.caps.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * CAPS 사용자 엔티티
 */
@Data
public class User {
    private Long   userSid;
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
    private String createdTime;   // 프로시저에서 날짜를 DATE/TIMESTAMP로 그대로 내보낼 때
    private String updatedUserName;
    private String updatedTime;
}

