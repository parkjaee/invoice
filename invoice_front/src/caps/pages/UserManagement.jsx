import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Stack
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

function UserManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // Filter states
  const [terminalCode, setTerminalCode] = useState('ALL');
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());

  // Dropdown options
  const [terminals, setTerminals] = useState([
    { code: 'ALL', name: 'ALL' },
    { code: '1T', name: '1Terminal'},
    { code: '2T', name: '2Terminal'}
  ]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [capsList, setCAPSList] = useState([]);

  // Load initial data
  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    // TODO: API calls to load dropdown data
    // For now, using mock data
    setDepartments([
      { code: 'DEPT01', name: '영업부' },
      { code: 'DEPT02', name: '관리부' }
    ]);
    setPositions([
      { code: 'POS01', name: '사원' },
      { code: 'POS02', name: '대리' },
      { code: 'POS03', name: '과장' }
    ]);
    setCAPSList([
      { id: 'CAPS001', name: 'CAPS User 1' },
      { id: 'CAPS002', name: 'CAPS User 2' }
    ]);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // TODO: API call to fetch user data
      // const response = await userService.getUsers(terminalCode, fromDate, toDate);

      // Mock data for now
      const mockData = [
        {
          id: 1,
          USER_SID: 1,
          TERMINAL_NAME_WORK: '1T',
          DEPARTMENT_CODE: 'DEPT02',
          POSITION_CODE: 'POS01',
          USER_NAME1: '박제훈',
          USER_ID: 'EMP001',
          COMPANY_CODE: 'COMP01',
          BRANCH_CODE: 'BR01'
        }
      ];
      setRows(mockData);
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
      // TODO: API call to save changes
      // const updates = rows.filter(row => selectedRows.includes(row.id));
      // await userService.updateUsers(updates);

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
      field: 'TERMINAL_NAME_WORK',
      headerName: '근무지',
      width: 100,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'DEPARTMENT_CODE',
      headerName: '부서',
      width: 150,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      type: 'singleSelect',
      valueOptions: departments.map(dept => ({
        value: dept.code,
        label: dept.name
      }))
    },
    {
      field: 'POSITION_CODE',
      headerName: '직급',
      width: 150,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      type: 'singleSelect',
      valueOptions: positions.map(pos => ({
        value: pos.code,
        label: pos.name
      }))
    },
    {
      field: 'USER_NAME1',
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
      width: 200,
      editable: true,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'USER_CHECKIN',
      headerName: '최종 기록',
      width: 200,
      editable: true,
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
        <Stack direction="row" spacing={2} alignItems="center">
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
