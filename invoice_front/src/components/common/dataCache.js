/**
 * 공통 데이터 캐시
 * 컴포넌트 간 데이터 공유 및 중복 API 호출 방지
 */

// 캐시 저장소
const cache = {
  terminals: null,
  airlines: null,
  departments: null
};

// 캐시 로딩 상태
const loading = {
  terminals: false,
  airlines: false,
  departments: false
};

// Promise 저장소 (동시 요청 방지)
const promises = {
  terminals: null,
  airlines: null,
  departments: null
};

/**
 * 터미널 목록 가져오기 (캐시된 데이터 사용)
 */
export const getTerminals = async (fetchFunction) => {
  // 캐시에 데이터가 있으면 즉시 반환
  if (cache.terminals) {
    return cache.terminals;
  }

  // 이미 로딩 중이면 기존 Promise 반환
  if (loading.terminals && promises.terminals) {
    return promises.terminals;
  }

  // 새로운 요청 시작
  loading.terminals = true;
  promises.terminals = fetchFunction()
    .then((data) => {
      cache.terminals = data;
      loading.terminals = false;
      promises.terminals = null;
      return data;
    })
    .catch((error) => {
      loading.terminals = false;
      promises.terminals = null;
      throw error;
    });

  return promises.terminals;
};

/**
 * 항공사 목록 가져오기 (캐시된 데이터 사용)
 */
export const getAirlines = async (fetchFunction) => {
  if (cache.airlines) {
    return cache.airlines;
  }

  if (loading.airlines && promises.airlines) {
    return promises.airlines;
  }

  loading.airlines = true;
  promises.airlines = fetchFunction()
    .then((data) => {
      cache.airlines = data;
      loading.airlines = false;
      promises.airlines = null;
      return data;
    })
    .catch((error) => {
      loading.airlines = false;
      promises.airlines = null;
      throw error;
    });

  return promises.airlines;
};

/**
 * 캐시 초기화 (테스트용 또는 특정 상황에서 사용)
 */
export const clearCache = (key = null) => {
  if (key) {
    cache[key] = null;
    loading[key] = false;
    promises[key] = null;
  } else {
    Object.keys(cache).forEach((k) => {
      cache[k] = null;
      loading[k] = false;
      promises[k] = null;
    });
  }
};

export default {
  getTerminals,
  getAirlines,
  clearCache
};


