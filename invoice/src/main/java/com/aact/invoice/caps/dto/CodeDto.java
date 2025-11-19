package com.aact.caps.dto;

/**
 * 공통 코드 DTO
 */
public class CodeDto {
    private Long codeSid;
    private String codeType;
    private String codeCode;
    private String codeName;
    private String codeNameEng;
    private Integer sortOrder;
    private String useYn;

    // Constructors
    public CodeDto() {
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
