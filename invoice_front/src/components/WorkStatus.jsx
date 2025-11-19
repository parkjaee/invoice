import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import dayjs from 'dayjs';
import DatePicker from './common/DatePicker';
import TerminalSelect from './common/TerminalSelect';
import AirlineSelect from './common/AirlineSelect';
import WorkStatusSelect from './common/WorkStatusSelect';
import './WorkStatus.css';

// Mock 데이터 - 부서 목록 (DB에서 가져올 예정)
const mockDepartments = [
  { id: 1, name: '검수' },
  { id: 2, name: '장비' },
  { id: 3, name: '조업' },
  { id: 4, name: 'RAMP' },
  { id: 5, name: '운송지원' },
  { id: 6, name: 'ULD' },
  { id: 7, name: '보세' },
];

// Mock 데이터 - 근무자 정보
const mockWorkers = [
  {
    id: 1,
    name: '김재훈',
    terminal: 'T1',
    department: '검수',
    scheduledStartTime: '07:00',
    actualStartTime: '07:00',
    scheduledEndTime: '17:00',
    actualEndTime: '14:00', // 현재시간보다 전에 퇴근
    flights: ['SQ601', 'SQ603']
  },
  {
    id: 2,
    name: '박제훈',
    terminal: 'T1',
    department: '장비',
    scheduledStartTime: '07:00',
    actualStartTime: '07:00',
    scheduledEndTime: '17:00',
    actualEndTime: null, // 아직 퇴근 안함, 현재 출근중
    flights: ['SQ601']
  },
  {
    id: 3,
    name: '신종훈',
    terminal: 'T2',
    department: '조업',
    scheduledStartTime: '07:00',
    actualStartTime: '07:00',
    scheduledEndTime: '12:00',
    actualEndTime: null, // 스케줄 퇴근시간 지났는데 아직 퇴근 안함 (추가근무)
    flights: ['TR501']
  },
  {
    id: 4,
    name: '근무자2',
    terminal: 'T1',
    department: 'RAMP',
    scheduledStartTime: '09:00',
    actualStartTime: '09:15',
    scheduledEndTime: '18:00',
    actualEndTime: null,
    flights: []
  },
  {
    id: 5,
    name: '근무자1',
    terminal: 'T2',
    department: '운송지원',
    scheduledStartTime: '08:00',
    actualStartTime: '08:00',
    scheduledEndTime: '17:00',
    actualEndTime: '17:00',
    flights: ['TG652']
  },
  {
    id: 6,
    name: '관리자',
    terminal: 'T1',
    department: null, // 관리자
    scheduledStartTime: '08:00',
    actualStartTime: '08:00',
    scheduledEndTime: '17:00',
    actualEndTime: null,
    flights: []
  }
];

function WorkStatus() {
  const [selectedTerminal, setSelectedTerminal] = useState('all');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedAirline, setSelectedAirline] = useState('all');
  const [selectedWorkStatus, setSelectedWorkStatus] = useState('all');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [airlines, setAirlines] = useState([]);
  const [departments, setDepartments] = useState(mockDepartments);
  const [workers, setWorkers] = useState(mockWorkers);
  const [currentTime, setCurrentTime] = useState(dayjs());

  // 현재 시간 업데이트 (1분마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // 1분마다 업데이트
    return () => clearInterval(timer);
  }, []);

  // 터미널과 항공사는 공통 컴포넌트에서 처리하므로 제거

  // 항공사 목록 가져오기 (공통 컴포넌트에서 기본값 사용, 필요시 여기서 커스터마이즈)
  useEffect(() => {
    // TODO: 백엔드 API로 항공사 목록 가져오기
    // setAirlines([...])로 설정하면 AirlineSelect에 전달 가능
    setAirlines([
      { code: 'SQ', name: 'SQ' },
      { code: 'TW', name: 'TW' },
      { code: 'TG', name: 'TG' },
      { code: 'TR', name: 'TR' }
    ]);
  }, []);

  // 부서 목록 가져오기
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // TODO: 백엔드 API로 부서 목록 가져오기
        // const response = await axios.get('/api/departments');
        // setDepartments(response.data);
        setDepartments(mockDepartments);
      } catch (error) {
        console.error('부서 목록 조회 실패:', error);
      }
    };
    fetchDepartments();
  }, []);

  // Flight 편번 클릭 이벤트 리스너
  useEffect(() => {
    const handleFlightSelect = (event) => {
      const flight = event.detail;
      setSelectedFlight(flight);
      // 항공편에 맞는 항공사 자동 선택
      if (flight.flightNo) {
        const airlineCode = flight.flightNo.substring(0, 2);
        const matchingAirline = airlines.find(a => a.code === airlineCode);
        if (matchingAirline) {
          setSelectedAirline(matchingAirline.code);
        }
      }
    };

    window.addEventListener('flightSelected', handleFlightSelect);
    return () => {
      window.removeEventListener('flightSelected', handleFlightSelect);
    };
  }, [airlines]);

  // 근무자 상태 계산
  const getWorkerStatus = (worker) => {
    const now = currentTime;
    const scheduledStart = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${worker.scheduledStartTime}`);
    const scheduledEnd = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${worker.scheduledEndTime}`);
    
    // 실제 퇴근시간이 있으면 퇴근
    if (worker.actualEndTime) {
      return { status: 'off', text: '퇴근', color: '#999' };
    }
    
    // 스케줄 퇴근시간이 지났는데 실제 퇴근시간이 없으면 추가근무
    if (now.isAfter(scheduledEnd)) {
      return { status: 'overtime', text: '추가근무', color: '#f44336' };
    }
    
    // 스케줄 출근시간이 지났고 퇴근시간 전이면 출근중
    if (now.isAfter(scheduledStart) && now.isBefore(scheduledEnd)) {
      return { status: 'working', text: '출근중', color: '#4caf50' };
    }
    
    return { status: 'scheduled', text: '예정', color: '#2196f3' };
  };

  // 필터링된 근무자 목록
  const filteredWorkers = workers.filter(worker => {
    const matchesTerminal = selectedTerminal === 'all' || worker.terminal === selectedTerminal;
    const matchesDepartment = selectedDepartment === 'all' || worker.department === selectedDepartment;
    const matchesAirline = selectedAirline === 'all' || 
      worker.flights.some(flight => flight.startsWith(selectedAirline));
    const matchesFlight = !selectedFlight || 
      worker.flights.some(flight => flight === selectedFlight.flightNo);
    
    // 근무상태 필터링: 출근 기록은 있는데 퇴근 시간이 없으면 근무중, 퇴근 시간이 있으면 퇴근
    const matchesWorkStatus = selectedWorkStatus === 'all' || 
      (selectedWorkStatus === 'working' && worker.actualStartTime && !worker.actualEndTime) ||
      (selectedWorkStatus === 'off' && worker.actualEndTime);
    
    return matchesTerminal && matchesDepartment && matchesAirline && matchesFlight && matchesWorkStatus;
  });

  // 시간대 생성 (6시 ~ 23시)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // 특정 시간대에 근무하는 근무자 찾기
  const getWorkersAtTime = (timeSlot, terminal, department) => {
    const [hour] = timeSlot.split(':').map(Number);
    const time = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${timeSlot}`);
    
    return filteredWorkers.filter(worker => {
      // 터미널 매칭
      if (terminal && worker.terminal !== terminal) return false;
      
      // 부서 매칭 (관리자는 department가 null)
      if (department === 'manager' && worker.department !== null) return false;
      if (department !== 'manager' && department && worker.department !== department) return false;
      
      const scheduledStart = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${worker.scheduledStartTime}`);
      const scheduledEnd = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${worker.scheduledEndTime}`);
      const actualEnd = worker.actualEndTime 
        ? dayjs(`${selectedDate.format('YYYY-MM-DD')} ${worker.actualEndTime}`)
        : null;
      
      // 해당 시간에 근무 중인지 확인
      const isWorking = time.isAfter(scheduledStart) && 
        (actualEnd ? time.isBefore(actualEnd) : time.isBefore(scheduledEnd));
      
      return isWorking;
    });
  };

  // 각 시간대별 합계 계산
  const getTimeSlotTotal = (timeSlot) => {
    return filteredWorkers.filter(worker => {
      const [hour] = timeSlot.split(':').map(Number);
      const time = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${timeSlot}`);
      
      const scheduledStart = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${worker.scheduledStartTime}`);
      const scheduledEnd = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${worker.scheduledEndTime}`);
      const actualEnd = worker.actualEndTime 
        ? dayjs(`${selectedDate.format('YYYY-MM-DD')} ${worker.actualEndTime}`)
        : null;
      
      const isWorking = time.isAfter(scheduledStart) && 
        (actualEnd ? time.isBefore(actualEnd) : time.isBefore(scheduledEnd));
      
      return isWorking;
    }).length;
  };

  // 각 부서별 합계 계산
  const getDepartmentTotal = (department) => {
    if (department === 'terminal') {
      // 터미널별로는 시간대별 근무자 수를 합산
      return null; // 터미널은 합계 계산 방식이 다름
    }
    if (department === 'manager') {
      return filteredWorkers.filter(w => w.department === null).length;
    }
    return filteredWorkers.filter(w => w.department === department).length;
  };

  return (
    <Box className="work-status-container">
      <Paper className="work-status-header">
        <Typography variant="h5" className="work-status-title">
          근무현황표
        </Typography>
        <Box className="work-status-filters">
          <DatePicker
            label="날짜"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
              setSelectedFlight(null); // 날짜 변경 시 항공편 선택 해제
            }}
          />
          
          <TerminalSelect
            value={selectedTerminal}
            onChange={(e) => setSelectedTerminal(e.target.value)}
            className="work-status-filter"
          />
          
          <FormControl size="small" className="work-status-filter">
            <InputLabel>부서</InputLabel>
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              label="부서"
            >
              <MenuItem value="all">전체</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <WorkStatusSelect
            value={selectedWorkStatus}
            onChange={(e) => setSelectedWorkStatus(e.target.value)}
            className="work-status-filter"
          />
        </Box>
      </Paper>

      {selectedFlight && (
        <Paper className="work-status-selected-flight">
          <Typography variant="subtitle1">
            선택된 Flight: {selectedFlight.flightNo} ({selectedFlight.terminal} | {selectedFlight.time})
          </Typography>
          <Chip
            label="필터 해제"
            size="small"
            onClick={() => setSelectedFlight(null)}
            sx={{ cursor: 'pointer' }}
          />
        </Paper>
      )}

      <TableContainer component={Paper} className="work-status-table-container">
        <Table stickyHeader className="work-status-table">
          <TableHead>
            <TableRow>
              <TableCell className="work-status-time-header">시간</TableCell>
              <TableCell className="work-status-terminal-header">터미널</TableCell>
              <TableCell className="work-status-manager-header">관리자</TableCell>
              {departments.map((dept) => (
                <TableCell key={dept.id} className="work-status-dept-header">
                  {dept.name}
                </TableCell>
              ))}
              <TableCell className="work-status-total-header">합계</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((timeSlot) => {
              const terminalWorkers = ['T1', 'T2', 'T3'].map(term => ({
                terminal: term,
                count: getWorkersAtTime(timeSlot, term, null).length
              }));
              
              return (
                <TableRow key={timeSlot}>
                  <TableCell className="work-status-time-cell">{timeSlot}</TableCell>
                  <TableCell className="work-status-terminal-cell">
                    {terminalWorkers.map(t => (
                      <Box key={t.terminal} className="work-status-terminal-item">
                        {t.terminal}: {t.count}
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell className="work-status-manager-cell">
                    {getWorkersAtTime(timeSlot, null, 'manager').map(worker => {
                      const status = getWorkerStatus(worker);
                      return (
                        <Chip
                          key={worker.id}
                          label={worker.name}
                          size="small"
                          sx={{
                            backgroundColor: status.color,
                            color: 'white',
                            fontSize: '11px',
                            height: '20px',
                            margin: '2px'
                          }}
                          title={`${status.text} | 스케줄: ${worker.scheduledStartTime}-${worker.scheduledEndTime}`}
                        />
                      );
                    })}
                  </TableCell>
                  {departments.map((dept) => {
                    const deptWorkers = getWorkersAtTime(timeSlot, null, dept.name);
                    return (
                      <TableCell key={dept.id} className="work-status-dept-cell">
                        {deptWorkers.map(worker => {
                          const status = getWorkerStatus(worker);
                          return (
                            <Chip
                              key={worker.id}
                              label={worker.name}
                              size="small"
                              sx={{
                                backgroundColor: status.color,
                                color: 'white',
                                fontSize: '11px',
                                height: '20px',
                                margin: '2px'
                              }}
                              title={`${status.text} | 스케줄: ${worker.scheduledStartTime}-${worker.scheduledEndTime} | 항공편: ${worker.flights.join(', ') || '없음'}`}
                            />
                          );
                        })}
                      </TableCell>
                    );
                  })}
                  <TableCell className="work-status-total-cell">
                    {getTimeSlotTotal(timeSlot)}
                  </TableCell>
                </TableRow>
              );
            })}
            {/* 합계 행 */}
            <TableRow className="work-status-summary-row">
              <TableCell className="work-status-summary-cell">합계</TableCell>
              <TableCell className="work-status-summary-cell">
                {['T1', 'T2', 'T3'].map(term => {
                  const total = filteredWorkers.filter(w => w.terminal === term).length;
                  return (
                    <Box key={term} className="work-status-terminal-item">
                      {term}: {total}
                    </Box>
                  );
                })}
              </TableCell>
              <TableCell className="work-status-summary-cell">
                {getDepartmentTotal('manager')}
              </TableCell>
              {departments.map((dept) => (
                <TableCell key={dept.id} className="work-status-summary-cell">
                  {getDepartmentTotal(dept.name)}
                </TableCell>
              ))}
              <TableCell className="work-status-summary-cell">
                {filteredWorkers.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default WorkStatus;
