import React from 'react';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/**
 * 공통 날짜 선택 컴포넌트
 * @param {Object} props
 * @param {dayjs.Dayjs} props.value - 선택된 날짜
 * @param {Function} props.onChange - 날짜 변경 콜백 함수
 * @param {string} props.label - 라벨 텍스트 (기본값: "날짜")
 * @param {string} props.format - 날짜 포맷 (기본값: "YYYY-MM-DD")
 * @param {Array} props.views - 날짜 선택 뷰 (기본값: ['year', 'month', 'day'])
 * @param {string} props.size - 크기 (기본값: "small")
 * @param {number} props.width - 너비 (기본값: 200)
 * @param {Object} props.slotProps - 추가 props
 */
const DatePicker = ({
  value,
  onChange,
  label = '날짜',
  format = 'YYYY-MM-DD',
  views = ['year', 'month', 'day'],
  size = 'small',
  width = 200,
  slotProps = {},
  ...rest
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        label={label}
        views={views}
        format={format}
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            size: size,
            sx: { width: width },
            ...slotProps.textField
          },
          ...slotProps
        }}
        {...rest}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;

