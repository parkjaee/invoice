import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/caps';

/**
 * 공통 코드 API 서비스
 */
const codeService = {
  /**
   * 터미널 코드 목록 조회 (TRMCD)
   * @returns {Promise<Array>} 터미널 코드 목록
   */
  async getTerminals() {
    try {
      const response = await axios.get(`${API_BASE_URL}/codes/terminals`);
      return response.data;
    } catch (error) {
      console.error('터미널 코드 조회 실패:', error);
      throw error;
    }
  },

  // 부서/직급 코드는 사용자 조회 시 JOIN으로 가져오므로 제거됨
  // getDepartments(), getPositions(), getCAPSList() 메서드 제거

  /**
   * 공통 코드 조회 (범용)
   * @param {string} codeType - 코드 타입 (예: TRMCD, DPTCD, POSTK, CAPS)
   * @returns {Promise<Array>} 코드 목록
   */
  async getCodesByType(codeType) {
    try {
      const response = await axios.get(`${API_BASE_URL}/codes?type=${codeType}`);
      return response.data;
    } catch (error) {
      console.error(`${codeType} 코드 조회 실패:`, error);
      throw error;
    }
  }
};

export default codeService;
