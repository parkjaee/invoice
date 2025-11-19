import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import codeService from '../../caps/services/codeService';
import { getTerminals } from './dataCache';

/**
 * 공통 터미널 선택 컴포넌트
 * @param {Object} props
 * @param {string} props.value - 선택된 터미널 코드 (기본값: "all")
 * @param {Function} props.onChange - 터미널 변경 콜백 함수
 * @param {string} props.label - 라벨 텍스트 (기본값: "터미널")
 * @param {string} props.size - 크기 (기본값: "small")
 * @param {boolean} props.includeAll - "전체" 옵션 포함 여부 (기본값: true)
 * @param {Object} props.sx - 추가 스타일
 */
const TerminalSelect = ({
  value,
  onChange,
  label = '터미널',
  size = 'small',
  includeAll = true,
  sx = {},
  ...rest
}) => {
  const [terminals, setTerminals] = useState([]);
  const [loading, setLoading] = useState(true);

  // 터미널 코드 목록 가져오기 (캐시 사용)
  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        setLoading(true);
        
        // 캐시를 통해 데이터 가져오기 (중복 요청 방지)
        const response = await getTerminals(async () => {
          return await codeService.getTerminals();
        });
        
        const terminalList = response.map(item => ({
          code: item.code || item.value || item,
          name: item.name || item.label || item
        }));
        
        const finalList = includeAll 
          ? [{ code: 'all', name: '전체' }, ...terminalList]
          : terminalList;
        
        setTerminals(finalList);
      } catch (error) {
        console.error('터미널 코드 조회 실패:', error);
        // Mock 데이터로 대체
        const mockList = includeAll
          ? [
              { code: 'all', name: '전체' },
              { code: 'T1', name: 'T1' },
              { code: 'T2', name: 'T2' },
              { code: 'T3', name: 'T3' }
            ]
          : [
              { code: 'T1', name: 'T1' },
              { code: 'T2', name: 'T2' },
              { code: 'T3', name: 'T3' }
            ];
        setTerminals(mockList);
      } finally {
        setLoading(false);
      }
    };
    fetchTerminals();
  }, [includeAll]);

  return (
    <FormControl size={size} sx={sx} {...rest}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || 'all'}
        onChange={onChange}
        label={label}
        disabled={loading}
      >
        {terminals.map((terminal) => (
          <MenuItem key={terminal.code} value={terminal.code}>
            {terminal.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TerminalSelect;

