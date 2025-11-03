package com.aact.caps.repository.jpa;

import com.aact.caps.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * CAPS 사용자 JPA Repository
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 사용자 ID로 조회
     */
    Optional<User> findByUserId(String userId);

    /**
     * 터미널 코드로 조회
     */
    List<User> findByTerminalCodeWork(String terminalCode);

    /**
     * 조건부 검색 (터미널 코드가 있는 경우)
     */
    @Query("SELECT u FROM User u WHERE " +
           "(:terminalCode IS NULL OR :terminalCode = '' OR u.terminalCodeWork = :terminalCode)")
    List<User> findUsersByCondition(@Param("terminalCode") String terminalCode);

    /**
     * 사용자 목록 조회 (정렬 포함)
     */
    @Query("SELECT u FROM User u ORDER BY u.terminalCodeWork, u.departmentCode, u.userId")
    List<User> findAllOrderedUsers();
}
