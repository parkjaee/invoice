import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Stack,
  Chip,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Search as SearchIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import userService from '../services/userService';
import codeService from '../services/codeService';

function UserManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // Filter states
  const [terminalCode, setTerminalCode] = useState('ALL');
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userSid, setUserSid] = useState('');
  const [showAttended, setShowAttended] = useState(true);      // 출근한 사람 표시
  const [showNotAttended, setShowNotAttended] = useState(true); // 미출근한 사람 표시

  // Dropdown options
  const [terminals, setTerminals] = useState([
    { code: 'ALL', name: 'ALL' },
    { code: '1T', name: '1터미널'},
    { code: '2T', name: '2터미널'}
  ]);

  // Load initial data
  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    // 터미널 코드 조회 (에러 발생 시 기본값 사용)
    try {
      const terminalData = await codeService.getTerminals();
      const terminalOptions = [
        { code: 'ALL', name: 'ALL' },
        ...terminalData.map(t => ({ code: t.codeCode, name: t.codeName}))
      ];
      setTerminals(terminalOptions);
    } catch (error) {
      console.warn('터미널 코드 조회 실패, 기본값 사용:', error);
      // 기본값 유지: [{ code: 'ALL', name: 'ALL' }, ...]
    }
  };

  /**
   * 최종기록 시간 문자열을 dayjs로 파싱
   *
   * */
  const parseCheckin = (value) => {
    if (!value) return null;
    const str = String(value).trim();
    if (!str) return null;

    if (/^\d{14}$/.test(str)) {
      return dayjs(str, 'YYYYMMDDHHmmss');
    }

    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str)) {
      return dayjs(str, 'YYYY-MM-DD HH:mm:ss');
    }

    return null;
  };

  /**
   * 최종기록 시간에 따라 출근여부 계산
   * @param checkinValue - 출근 시간 (14자리 타임스탬프)
   * @param attendanceDateValue - 출퇴근 날짜 (8자리 YYYYMMDD)
   */
  const getUserStatus = (checkinValue, attendanceDateValue) => {
    // 출근 시간이 없으면 미출근
    if (!checkinValue || checkinValue.trim() === '') {
      return '미출근';
    }

    const checkin = parseCheckin(checkinValue);
    if (!checkin) return '미출근';

    // 현재는 단순히 출근 기록 유무만 체크
    return '출근';
  };

  /**
   * 근무시간(오버타임) 계산
   * @param checkinValue - 출근 시간 (14자리 타임스탬프)
   * @param checkoutValue - 퇴근 시간 (14자리 타임스탬프)
   * @returns 근무시간 (예: "8시간 30분", "9시간")
   */
  const calculateWorkingHours = (checkinValue, checkoutValue) => {
    // 출근 또는 퇴근 시간이 없으면 계산 불가
    if (!checkinValue || checkinValue.trim() === '' ||
        !checkoutValue || checkoutValue.trim() === '') {
      return '-';
    }

    const checkin = parseCheckin(checkinValue);
    const checkout = parseCheckin(checkoutValue);

    if (!checkin || !checkout) return '-';

    // 퇴근 시간이 출근 시간보다 빠르면 (익일 퇴근)
    if (checkout.isBefore(checkin)) {
      return '-';
    }

    // 시간 차이 계산 (분 단위)
    const diffMinutes = checkout.diff(checkin, 'minute');

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (minutes === 0) {
      return `${hours}시간`;
    }
    return `${hours}시간 ${minutes}분`;
  };


  /**
   * MSSQL 날짜 형식 변환
   * "20251106090115" (YYYYMMDDHHmmss) -> "2025-11-06 09:01:15"
   */
  const formatCheckinTime = (timeStr) => {
    if (!timeStr || timeStr.trim() === '') {
      return '';
    }

    try {
      // "20251106090115" 형식 파싱 (14자리 숫자)
      if (timeStr.length === 14 && /^\d{14}$/.test(timeStr)) {
        const year = timeStr.substring(0, 4);
        const month = timeStr.substring(4, 6);
        const day = timeStr.substring(6, 8);
        const hour = timeStr.substring(8, 10);
        const minute = timeStr.substring(10, 12);
        const second = timeStr.substring(12, 14);

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      }

      // 파싱 실패시 원본 반환
      return timeStr;
    } catch (error) {
      console.error('날짜 포맷 변환 실패:', error);
      return timeStr;
    }
  };

  /**
   * 날짜 형식 변환
   * "20251106" (YYYYMMDD) -> "2025-11-06"
   */
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') {
      return '';
    }

    try {
      // "20251106" 형식 파싱 (8자리 숫자)
      if (dateStr.length === 8 && /^\d{8}$/.test(dateStr)) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);

        return `${year}-${month}-${day}`;
      }

      // 파싱 실패시 원본 반환
      return dateStr;
    } catch (error) {
      console.error('날짜 포맷 변환 실패:', error);
      return dateStr;
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {

      const params = {
        terminalCode: terminalCode === 'ALL' ? '' : terminalCode,
        fromDate: fromDate ? fromDate.format('YYYY-MM-DD') : '',
        toDate: toDate ? toDate.format('YYYY-MM-DD') : '',
        userName: userName.trim(),
        userId: userId.trim(),
        userSid: userSid.trim(),
        showAttended: showAttended,
        showNotAttended: showNotAttended
      };

      const response = await userService.getUsers(params);


      // 백엔드 응답 > 프론트 형식 변환
      const mappedData = response.map((user, index) => ({
        id: `${user.userSid || index}_${user.attendanceDate || ''}`,  // 고유 ID (사번 + 날짜)
        USER_ID: user.userId,
        USER_NAME: user.userName,
        DEPARTMENT_CODE: user.departmentCode,
        DEPARTMENT_NAME: user.departmentName,
        POSITION_CODE: user.positionCode,
        POSITION_NAME: user.positionName,
        ATTENDANCE_DATE: formatDate(user.attendanceDate), // 출퇴근 날짜
        USER_STATUS: getUserStatus(user.userCheckin, user.attendanceDate),
        USER_CHECKIN: formatCheckinTime(user.userCheckin), // 출근 시간
        USER_CHECKOUT: formatCheckinTime(user.userCheckout), // 퇴근 시간
        OVERTIME: calculateWorkingHours(user.userCheckin, user.userCheckout) // 근무시간
      }));
        setRows(mappedData);
    } catch (error) {
      console.error('조회 중 오류 발생:', error);
      alert('데이터 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (selectedRows.length === 0) {
      alert('변경된 데이터가 없습니다.');
      return;
    }

    try {
      alert('저장되었습니다.');
      handleSearch(); // Refresh data
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleProcessRowUpdate = (newRow) => {
    const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
    setRows(updatedRows);
    return newRow;
  };

  const columns = [
    {
      field: 'ATTENDANCE_DATE',
      headerName: '날짜',
      width: 120,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'TERMINAL_NAME_WORK',
      headerName: '근무지',
      width: 100,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'DEPARTMENT_NAME',
      headerName: '부서',
      width: 150,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'POSITION_NAME',
      headerName: '직급',
      width: 150,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'USER_NAME',
      headerName: '이름',
      width: 120,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'USER_ID',
      headerName: '사번',
      width: 120,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'USER_STATUS',
      headerName: '출근여부',
      width: 120,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const status = params.value;
        let color = 'default';

        if (status === '정상출근') {
          color = 'success';
        } else if (status === '지각') {
          color = 'warning';
        } else if (status === '미출근') {
          color = 'default';
        }

        return <Chip label={status} color={color} size="small" />;
      }
    },
    {
      field: 'USER_CHECKIN',
      headerName: '출근 시간',
      width: 180,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'USER_CHECKOUT',
      headerName: '퇴근 시간',
      width: 180,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'OVERTIME',
      headerName: '근무시간',
      width: 120,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    }
  ];

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 100px)' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h1" sx={{ color: 'green'}}>
          사용자 목록 (CAPS연동)
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            조회
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            저장
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<EditIcon />}
          >
            수정
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            삭제
          </Button>
        </Stack>
      </Box>

      {/* Filter Section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Box sx={{ minWidth: 150 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>터미널</Typography>
            <TextField
              select
              size="small"
              fullWidth
              value={terminalCode}
              onChange={(e) => setTerminalCode(e.target.value)}
            >
              {terminals.map((terminal) => (
                <MenuItem key={terminal.code} value={terminal.code}>
                  {terminal.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>기간</Typography>
              <DatePicker
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { size: 'small' } }}
                format="YYYY-MM-DD"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-end', pb: 0.5 }}>
              <Typography variant="body2">부터</Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>&nbsp;</Typography>
              <DatePicker
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { size: 'small' } }}
                format="YYYY-MM-DD"
              />
            </Box>
          </LocalizationProvider>

          <Box sx={{ minWidth: 120 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>이름</Typography>
            <TextField
              size="small"
              fullWidth
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="이름 입력"
            />
          </Box>

          <Box sx={{ minWidth: 120 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>사번</Typography>
            <TextField
              size="small"
              fullWidth
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="사번 입력"
            />
          </Box>

          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>출퇴근 필터</Typography>
            <Stack direction="row" spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showAttended}
                    onChange={(e) => setShowAttended(e.target.checked)}
                    size="small"
                  />
                }
                label="출근"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showNotAttended}
                    onChange={(e) => setShowNotAttended(e.target.checked)}
                    size="small"
                  />
                }
                label="미출근"
              />
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Data Grid */}
      <Paper sx={{ height: 'calc(100% - 180px)' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error('Row update error:', error);
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 }
            }
          }}
          pageSizeOptions={[25, 50, 100]}
          sx={{
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid #e0e0e0'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              borderRight: '1px solid #e0e0e0'
            }
          }}
        />
      </Paper>
    </Box>
  );
}

export default UserManagement;
