import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/caps';

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
      const response = await axios.get(`${API_BASE_URL}/codes/TRMCD`);
      return response.data;
    } catch (error) {
      console.error('터미널 코드 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 부서 코드 목록 조회 (DPTCD)
   * @returns {Promise<Array>} 부서 코드 목록
   */
  async getDepartments() {
    try {
      const response = await axios.get(`${API_BASE_URL}/codes/DPTCD`);
      return response.data;
    } catch (error) {
      console.error('부서 코드 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 직급 코드 목록 조회 (POSTK)
   * @returns {Promise<Array>} 직급 코드 목록
   */
  async getPositions() {
    try {
      const response = await axios.get(`${API_BASE_URL}/codes/POSTK`);
      return response.data;
    } catch (error) {
      console.error('직급 코드 조회 실패:', error);
      throw error;
    }
  },

  /**
   * CAPS 사용자 목록 조회 (CAPS)
   * @returns {Promise<Array>} CAPS 사용자 목록
   */
  async getCAPSList() {
    try {
      const response = await axios.get(`${API_BASE_URL}/codes/CAPS`);
      return response.data;
    } catch (error) {
      console.error('CAPS 목록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 공통 코드 조회 (범용)
   * @param {string} codeType - 코드 타입 (예: TRMCD, DPTCD, POSTK, CAPS)
   * @returns {Promise<Array>} 코드 목록
   */
  async getCodesByType(codeType) {
    try {
      const response = await axios.get(`${API_BASE_URL}/codes/${codeType}`);
      return response.data;
    } catch (error) {
      console.error(`${codeType} 코드 조회 실패:`, error);
      throw error;
    }
  }
};

export default codeService;
