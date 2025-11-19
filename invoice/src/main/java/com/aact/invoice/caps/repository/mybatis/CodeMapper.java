package com.aact.invoice.caps.repository.mybatis;

import org.apache.ibatis.annotations.Mapper;
import java.util.Map;

@Mapper
public interface CodeMapper {

    /**
     * 코드 조회 프로시저 호출
     * PCM_CODE_P010_001
     *
     * @param params 프로시저 파라미터 맵
     *               - I_CODE_TYPE: 코드 타입 (TRMCD, DPTCD, POSTK, CAPS)
     *               - I_CODE_CODE: 코드 (optional)
     *               - I_LANGUAGE_CODE: 언어 코드
     *               - I_PROGRESS_GUID: 진행 GUID
     *               - I_REQUEST_USER_ID: 요청 사용자 ID
     *               - I_REQUEST_IP_ADDRESS: 요청 IP
     *               - I_REQUEST_PROGRAM_ID: 요청 프로그램 ID
     *               - O_RESULT_CURSOR: 결과 커서 (OUT)
     *               - O_ERROR_FLAG: 에러 플래그 (OUT)
     *               - O_RETURN_CODE: 리턴 코드 (OUT)
     *               - O_RETURN_MESSAGE: 리턴 메시지 (OUT)
     */
    void callGetCodes(Map<String, Object> params);
}
