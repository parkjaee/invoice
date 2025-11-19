import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { getAirlines } from './dataCache';

/**
 * 공통 항공사 선택 컴포넌트
 * @param {Object} props
 * @param {string} props.value - 선택된 항공사 코드 (기본값: "all")
 * @param {Function} props.onChange - 항공사 변경 콜백 함수
 * @param {string} props.label - 라벨 텍스트 (기본값: "항공사")
 * @param {string} props.size - 크기 (기본값: "small")
 * @param {boolean} props.includeAll - "전체" 옵션 포함 여부 (기본값: true)
 * @param {Array} props.airlines - 항공사 목록 (외부에서 전달받을 경우)
 * @param {Function} props.onFetchAirlines - 항공사 목록을 가져오는 함수
 * @param {Object} props.sx - 추가 스타일
 */
const AirlineSelect = ({
  value,
  onChange,
  label = '항공사',
  size = 'small',
  includeAll = true,
  airlines: externalAirlines = null,
  onFetchAirlines = null,
  sx = {},
  ...rest
}) => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);

  // 항공사 목록 가져오기 (캐시 사용)
  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        setLoading(true);
        
        // 외부에서 항공사 목록을 전달받은 경우 (캐시 우회)
        if (externalAirlines) {
          const finalList = includeAll
            ? [{ code: 'all', name: '전체' }, ...externalAirlines]
            : externalAirlines;
          setAirlines(finalList);
          setLoading(false);
          return;
        }
        
        // onFetchAirlines 함수가 제공된 경우 (캐시 사용)
        if (onFetchAirlines) {
          const response = await getAirlines(onFetchAirlines);
          const finalList = includeAll
            ? [{ code: 'all', name: '전체' }, ...response]
            : response;
          setAirlines(finalList);
          setLoading(false);
          return;
        }
        
        // 기본 Mock 데이터 (캐시 사용)
        const response = await getAirlines(async () => {
          return [
            { code: 'SQ', name: 'SQ' },
            { code: 'TW', name: 'TW' },
            { code: 'TG', name: 'TG' },
            { code: 'TR', name: 'TR' },
            { code: 'KE', name: 'KE' },
            { code: 'OZ', name: 'OZ' }
          ];
        });
        
        const finalList = includeAll
          ? [{ code: 'all', name: '전체' }, ...response]
          : response;
        
        setAirlines(finalList);
      } catch (error) {
        console.error('항공사 목록 조회 실패:', error);
        // Mock 데이터로 대체
        const mockList = includeAll
          ? [
              { code: 'all', name: '전체' },
              { code: 'SQ', name: 'SQ' },
              { code: 'TW', name: 'TW' },
              { code: 'TG', name: 'TG' }
            ]
          : [
              { code: 'SQ', name: 'SQ' },
              { code: 'TW', name: 'TW' },
              { code: 'TG', name: 'TG' }
            ];
        setAirlines(mockList);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAirlines();
  }, [externalAirlines, onFetchAirlines, includeAll]);

  return (
    <FormControl size={size} sx={sx} {...rest}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || 'all'}
        onChange={onChange}
        label={label}
        disabled={loading}
      >
        {airlines.map((airline) => (
          <MenuItem key={airline.code} value={airline.code}>
            {airline.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AirlineSelect;

