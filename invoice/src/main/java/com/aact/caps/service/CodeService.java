package com.aact.caps.service;

import com.aact.caps.dto.CodeDto;
import com.aact.caps.entity.Code;
import com.aact.caps.repository.jpa.CodeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 공통 코드 서비스
 */
@Service
@Transactional(readOnly = true)
public class CodeService {

    @Autowired
    private CodeRepository codeRepository;

    /**
     * 코드 타입별 코드 목록 조회 (사용 중인 것만)
     */
    public List<CodeDto> getCodesByType(String codeType) {
        List<Code> codes = codeRepository.findByCodeTypeAndUseYn(codeType);
        return codes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 터미널 코드 목록 조회
     */
    public List<CodeDto> getTerminals() {
        return getCodesByType("TRMCD");
    }

    /**
     * 부서 코드 목록 조회
     */
    public List<CodeDto> getDepartments() {
        return getCodesByType("DPTCD");
    }

    /**
     * 직급 코드 목록 조회
     */
    public List<CodeDto> getPositions() {
        return getCodesByType("POSTK");
    }

    /**
     * CAPS 사용자 목록 조회
     */
    public List<CodeDto> getCAPSList() {
        return getCodesByType("CAPS");
    }

    /**
     * Entity를 DTO로 변환
     */
    private CodeDto convertToDto(Code code) {
        CodeDto dto = new CodeDto();
        BeanUtils.copyProperties(code, dto);
        return dto;
    }
}
