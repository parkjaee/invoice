package com.aact.invoice.caps.entity;

import jakarta.persistence.*;

/**
 * 공통 코드 엔티티
 * 테이블: CM_CODE (또는 해당 코드 테이블)
 * TODO: CM_CODE 테이블이 생성되면 @Entity 주석 해제
 */
//@Entity
//@Table(name = "CM_CODE")
public class Code {

    @Id
    @Column(name = "CODE_SID")
    private Long codeSid;

    @Column(name = "CODE_TYPE", nullable = false, length = 20)
    private String codeType;  // TRMCD, DPTCD, POSTK, CAPS 등

    @Column(name = "CODE_CODE", nullable = false, length = 50)
    private String codeCode;

    @Column(name = "CODE_NAME", length = 200)
    private String codeName;

    @Column(name = "CODE_NAME_ENG", length = 200)
    private String codeNameEng;

    @Column(name = "SORT_ORDER")
    private Integer sortOrder;

    @Column(name = "USE_YN", length = 1)
    private String useYn;

    // Constructors
    public Code() {
    }

    // Getters and Setters
    public Long getCodeSid() {
        return codeSid;
    }

    public void setCodeSid(Long codeSid) {
        this.codeSid = codeSid;
    }

    public String getCodeType() {
        return codeType;
    }

    public void setCodeType(String codeType) {
        this.codeType = codeType;
    }

    public String getCodeCode() {
        return codeCode;
    }

    public void setCodeCode(String codeCode) {
        this.codeCode = codeCode;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public String getCodeNameEng() {
        return codeNameEng;
    }

    public void setCodeNameEng(String codeNameEng) {
        this.codeNameEng = codeNameEng;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getUseYn() {
        return useYn;
    }

    public void setUseYn(String useYn) {
        this.useYn = useYn;
    }
}
