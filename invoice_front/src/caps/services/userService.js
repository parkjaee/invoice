import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/caps';

/**
 * CAPS 사용자 관리 API 서비스
 */
const userService = {
  /**
   * 사용자 목록 조회
   * @param {Object} params - 조회 파라미터
   * @param {string} params.terminalCode - 터미널 코드
   * @param {string} params.fromDate - 시작 날짜 (YYYY-MM-DD)
   * @param {string} params.toDate - 종료 날짜 (YYYY-MM-DD)
   * @returns {Promise<Array>} 사용자 목록
   */
  async getUsers(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        params: {
          terminalCode: params.terminalCode || '',
          fromDate: params.fromDate || '',
          toDate: params.toDate || ''
        }
      });
      return response.data;
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 사용자 정보 수정 (일괄 업데이트)
   * @param {Array} users - 수정할 사용자 정보 배열
   * @returns {Promise<Object>} 업데이트 결과
   */
  async updateUsers(users) {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/batch`, users);
      return response.data;
    } catch (error) {
      console.error('사용자 정보 수정 실패:', error);
      throw error;
    }
  },

  /**
   * 단일 사용자 정보 수정
   * @param {string} userId - 사용자 ID (사번)
   * @param {Object} userData - 수정할 사용자 정보
   * @returns {Promise<Object>} 업데이트 결과
   */
  async updateUser(userId, userData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('사용자 정보 수정 실패:', error);
      throw error;
    }
  },

  /**
   * 사용자 삭제 (일괄)
   * @param {Array<string>} userIds - 삭제할 사용자 ID 배열
   * @returns {Promise<Object>} 삭제 결과
   */
  async deleteUsers(userIds) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users`, {
        data: { userIds }
      });
      return response.data;
    } catch (error) {
      console.error('사용자 삭제 실패:', error);
      throw error;
    }
  }
};

export default userService;
