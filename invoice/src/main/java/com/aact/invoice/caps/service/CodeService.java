package com.aact.invoice.caps.service;

import com.aact.invoice.caps.dto.CodeDto;
import com.aact.invoice.caps.dto.ProcResult;
import com.aact.invoice.caps.dto.request.RequestMeta;
import com.aact.invoice.caps.repository.mybatis.CodeMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.util.*;

@Service
@Transactional
public class CodeService {

    private final CodeMapper codeMapper;

    public CodeService(CodeMapper codeMapper) {
        this.codeMapper = codeMapper;
    }

    /**
     * 코드 조회 (PCM_CODE_P010_001)
     *
     * @param codeType 코드 타입 (TRMCD, DPTCD, POSTK, CAPS)
     * @param codeCode 코드 (optional, 빈 문자열 가능)
     * @param meta     요청 메타 정보
     * @return 코드 목록
     */
    public ProcResult<List<CodeDto>> getCodes(String codeType, String codeCode, RequestMeta meta) {

        Map<String, Object> params = new HashMap<>();

        // IN 파라미터
        params.put("I_CODE_TYPE", codeType);
        params.put("I_CODE_CODE", codeCode != null ? codeCode : "");
        params.put("I_LANGUAGE_CODE", "KOR");
        params.put("I_PROGRESS_GUID", meta.progressGuid());
        params.put("I_REQUEST_USER_ID", meta.requestUserId());
        params.put("I_REQUEST_IP_ADDRESS", meta.requestIp());
        params.put("I_REQUEST_PROGRAM_ID", meta.programId());

        // OUT 파라미터
        params.put("O_RESULT_CURSOR", null);
        params.put("O_ERROR_FLAG", null);
        params.put("O_RETURN_CODE", null);
        params.put("O_RETURN_MESSAGE", null);

        // 프로시저 호출
        codeMapper.callGetCodes(params);

        // 결과 추출
        String errorFlag = (String) params.get("O_ERROR_FLAG");
        String returnCode = (String) params.get("O_RETURN_CODE");
        String returnMessage = (String) params.get("O_RETURN_MESSAGE");

        @SuppressWarnings("unchecked")
        List<CodeDto> codes = (List<CodeDto>) params.getOrDefault("O_RESULT_CURSOR", new ArrayList<>());

        if ("Y".equalsIgnoreCase(errorFlag)) {
            throw new ProcCallException(returnCode, returnMessage);
        }

        return new ProcResult<>(codes, returnCode, returnMessage, false);
    }

    /**
     * 터미널 코드 조회 (프로시저 사용)
     */
    public ProcResult<List<CodeDto>> getTerminals(RequestMeta meta) {
        return getCodes("TRMCD", "", meta);
    }

    // 부서/직급 코드는 userInfoMapper에서 JOIN으로 조회하므로 제거됨

    /**
     * 프로시저 호출 예외
     */
    public static class ProcCallException extends RuntimeException {
        private final String code;

        public ProcCallException(String code, String message) {
            super(message);
            this.code = code;
        }

        public String getCode() {
            return code;
        }
    }
}
