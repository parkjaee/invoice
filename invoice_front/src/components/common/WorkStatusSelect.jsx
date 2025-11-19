import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

/**
 * 공통 근무 상태 선택 컴포넌트 (근무중/퇴근 구분)
 * @param {Object} props
 * @param {string} props.value - 선택된 상태 값 (기본값: "all")
 * @param {Function} props.onChange - 상태 변경 콜백 함수
 * @param {string} props.label - 라벨 텍스트 (기본값: "근무상태")
 * @param {string} props.size - 크기 (기본값: "small")
 * @param {boolean} props.includeAll - "전체" 옵션 포함 여부 (기본값: true)
 * @param {Object} props.sx - 추가 스타일
 */
const WorkStatusSelect = ({
  value,
  onChange,
  label = '근무상태',
  size = 'small',
  includeAll = true,
  sx = {},
  ...rest
}) => {
  const statusOptions = [
    ...(includeAll ? [{ code: 'all', name: '전체' }] : []),
    { code: 'working', name: '근무중' },
    { code: 'off', name: '퇴근' }
  ];

  return (
    <FormControl size={size} sx={sx} {...rest}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || (includeAll ? 'all' : '')}
        onChange={onChange}
        label={label}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.code} value={option.code}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default WorkStatusSelect;

