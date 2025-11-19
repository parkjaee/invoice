package com.aact.caps.repository.jpa;

import com.aact.caps.entity.Code;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 공통 코드 JPA Repository
 */
@Repository
public interface CodeRepository extends JpaRepository<Code, Long> {

    /**
     * 코드 타입으로 조회 (사용 중인 것만)
     */
    @Query("SELECT c FROM Code c WHERE c.codeType = :codeType AND c.useYn = 'Y' ORDER BY c.sortOrder, c.codeCode")
    List<Code> findByCodeTypeAndUseYn(@Param("codeType") String codeType);

    /**
     * 코드 타입으로 모두 조회
     */
    List<Code> findByCodeTypeOrderBySortOrder(String codeType);

    /**
     * 코드 타입과 코드 값으로 조회
     */
    Code findByCodeTypeAndCodeCode(String codeType, String codeCode);
}
