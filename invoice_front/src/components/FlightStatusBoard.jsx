import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import DatePicker from './common/DatePicker';
import TerminalSelect from './common/TerminalSelect';
import AirlineSelect from './common/AirlineSelect';
import './FlightStatusBoard.css';

// Mock 데이터 - 실제로는 백엔드 API에서 받아올 예정
const mockArrivalFlights = [
  {
    id: 1,
    airline: '이스타항공',
    airlineCode: 'ZE',
    flightNo: 'ZE626',
    origin: 'CTS',
    originName: '삿포로',
    sta: '1600',
    eta: '1553',
    ata: '1542',
    category: '여객',
    status: '도착',
    remarks: ''
  },
  {
    id: 2,
    airline: '아시아나항공',
    airlineCode: 'OZ',
    flightNo: 'OZ364',
    origin: 'PVG',
    originName: '푸동',
    sta: '1600',
    eta: '1607',
    ata: '1556',
    category: '여객',
    status: '도착',
    remarks: ''
  },
  {
    id: 3,
    airline: '진에어',
    airlineCode: 'LJ',
    flightNo: 'LJ732',
    origin: 'TPE',
    originName: '타이완 타오위안 국제 공항',
    sta: '1605',
    eta: '1623',
    ata: '1616',
    category: '여객',
    status: '지연',
    remarks: ''
  },
  {
    id: 4,
    airline: '대한항공',
    airlineCode: 'KE',
    flightNo: 'KE9576',
    origin: 'MXP',
    originName: '밀라노',
    sta: '1610',
    eta: '1618',
    ata: '1600',
    category: '화물',
    status: '도착',
    remarks: ''
  }
];

const mockDepartureFlights = [
  {
    id: 1,
    airline: '대한항공',
    airlineCode: 'KE',
    flightNo: 'KE023',
    destination: 'SFO',
    destinationName: '샌프란시스코',
    std: '1600',
    etd: '1600',
    atd: '1619',
    category: '여객',
    status: '출발',
    remarks: ''
  },
  {
    id: 2,
    airline: '아시아나항공',
    airlineCode: 'OZ',
    flightNo: 'OZ725',
    destination: 'HKT',
    destinationName: '푸켓',
    std: '1600',
    etd: '1600',
    atd: '1621',
    category: '여객',
    status: '출발',
    remarks: ''
  },
  {
    id: 3,
    airline: '제주항공',
    airlineCode: '7C',
    flightNo: '7C1603',
    destination: 'FSZ',
    destinationName: '시즈오카',
    std: '1605',
    etd: '1605',
    atd: '1616',
    category: '여객',
    status: '출발',
    remarks: ''
  },
  {
    id: 4,
    airline: '미얀마국제항공',
    airlineCode: '8M',
    flightNo: '8M802',
    destination: 'RGN',
    destinationName: '양곤',
    std: '1605',
    etd: '1605',
    atd: '1626',
    category: '여객',
    status: '출발',
    remarks: ''
  }
];

function FlightStatusBoard({ isOpen, onClose, selectedDate, onDateChange, isCalendarExpanded = false }) {
  const [arrivalFlights, setArrivalFlights] = useState([]);
  const [departureFlights, setDepartureFlights] = useState([]);
  const [selectedTerminal, setSelectedTerminal] = useState('all');
  const [selectedAirline, setSelectedAirline] = useState('all');
  const [currentDate, setCurrentDate] = useState(selectedDate || dayjs());

  // 날짜가 외부에서 변경되면 내부 상태도 업데이트
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  // 날짜 변경 시 데이터 조회
  useEffect(() => {
    if (isOpen) {
      fetchFlights();
    }
  }, [currentDate, selectedTerminal, selectedAirline, isOpen]);

  const fetchFlights = async () => {
    try {
      // TODO: 백엔드 API 호출
      // const response = await axios.get('/api/flights', {
      //   params: {
      //     date: currentDate.format('YYYY-MM-DD'),
      //     terminal: selectedTerminal !== 'all' ? selectedTerminal : null,
      //     airline: selectedAirline !== 'all' ? selectedAirline : null
      //   }
      // });
      // setArrivalFlights(response.data.arrivals);
      // setDepartureFlights(response.data.departures);

      // Mock 데이터 필터링
      let filteredArrivals = [...mockArrivalFlights];
      let filteredDepartures = [...mockDepartureFlights];
      
      if (selectedAirline !== 'all') {
        filteredArrivals = filteredArrivals.filter(f => f.flightNo.startsWith(selectedAirline));
        filteredDepartures = filteredDepartures.filter(f => f.flightNo.startsWith(selectedAirline));
      }
      
      setArrivalFlights(filteredArrivals);
      setDepartureFlights(filteredDepartures);
    } catch (error) {
      console.error('운항현황 조회 실패:', error);
      setArrivalFlights([]);
      setDepartureFlights([]);
    }
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case '도착':
      case '출발':
        return '#2196f3'; // 파란색
      case '지연':
        return '#f44336'; // 빨간색
      default:
        return '#999';
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr || timeStr.length < 4) return '-';
    return `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}`;
  };

  const getAirlineInitials = (airline) => {
    if (!airline) return '';
    // 항공사 이름에서 초성 추출 (간단한 예시)
    return airline.substring(0, 2);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Box className={`flight-status-board ${isCalendarExpanded ? 'calendar-expanded' : ''}`}>
      <Paper className="flight-status-board-header">
        <Box className="flight-status-board-header-top">
          <Typography variant="h5" className="flight-status-board-title">
            운항현황판
          </Typography>
          <IconButton
            size="small"
            onClick={onClose}
            className="flight-status-board-close-button"
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Box className="flight-status-board-filters">
          <TerminalSelect
            value={selectedTerminal}
            onChange={(e) => setSelectedTerminal(e.target.value)}
            label="터미널"
          />
          <DatePicker
            label="날짜"
            value={currentDate}
            onChange={handleDateChange}
          />
          <AirlineSelect
            value={selectedAirline}
            onChange={(e) => setSelectedAirline(e.target.value)}
            label="항공사"
          />
        </Box>
      </Paper>

      <Box className="flight-status-board-content">
        {/* 입항 테이블 */}
        <Box className="flight-status-section">
          <Typography variant="h6" className="flight-status-section-title">
            입항
          </Typography>
          <TableContainer component={Paper} className="flight-status-table-container">
            <Table stickyHeader className="flight-status-table">
              <TableHead>
                <TableRow>
                  <TableCell className="flight-status-header-cell">항공사</TableCell>
                  <TableCell className="flight-status-header-cell">편명</TableCell>
                  <TableCell className="flight-status-header-cell">출발지</TableCell>
                  <TableCell className="flight-status-header-cell">STA</TableCell>
                  <TableCell className="flight-status-header-cell">ETA</TableCell>
                  <TableCell className="flight-status-header-cell">ATA</TableCell>
                  <TableCell className="flight-status-header-cell">구분</TableCell>
                  <TableCell className="flight-status-header-cell">상태</TableCell>
                  <TableCell className="flight-status-header-cell">비고</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {arrivalFlights.length > 0 ? (
                  arrivalFlights.map((flight) => (
                    <TableRow key={flight.id} className="flight-status-row">
                      <TableCell>
                        <Box className="airline-cell">
                          <Box className="airline-logo">{getAirlineInitials(flight.airline)}</Box>
                          <Typography variant="body2" className="airline-name">
                            {flight.airline}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {flight.flightNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {flight.origin}({flight.originName})
                        </Typography>
                      </TableCell>
                      <TableCell>{formatTime(flight.sta)}</TableCell>
                      <TableCell>{formatTime(flight.eta)}</TableCell>
                      <TableCell>{formatTime(flight.ata)}</TableCell>
                      <TableCell>{flight.category}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          className="status-button"
                          sx={{
                            backgroundColor: getStatusColor(flight.status),
                            color: 'white',
                            minWidth: '60px',
                            fontSize: '12px',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: getStatusColor(flight.status),
                              opacity: 0.9
                            }
                          }}
                        >
                          {flight.status}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {flight.remarks || '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      해당 조건에 맞는 입항 정보가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 출항 테이블 */}
        <Box className="flight-status-section">
          <Typography variant="h6" className="flight-status-section-title">
            출항
          </Typography>
          <TableContainer component={Paper} className="flight-status-table-container">
            <Table stickyHeader className="flight-status-table">
              <TableHead>
                <TableRow>
                  <TableCell className="flight-status-header-cell">항공사</TableCell>
                  <TableCell className="flight-status-header-cell">편명</TableCell>
                  <TableCell className="flight-status-header-cell">도착지</TableCell>
                  <TableCell className="flight-status-header-cell">STD</TableCell>
                  <TableCell className="flight-status-header-cell">ETD</TableCell>
                  <TableCell className="flight-status-header-cell">ATD</TableCell>
                  <TableCell className="flight-status-header-cell">구분</TableCell>
                  <TableCell className="flight-status-header-cell">상태</TableCell>
                  <TableCell className="flight-status-header-cell">비고</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departureFlights.length > 0 ? (
                  departureFlights.map((flight) => (
                    <TableRow key={flight.id} className="flight-status-row">
                      <TableCell>
                        <Box className="airline-cell">
                          <Box className="airline-logo">{getAirlineInitials(flight.airline)}</Box>
                          <Typography variant="body2" className="airline-name">
                            {flight.airline}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {flight.flightNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {flight.destination}({flight.destinationName})
                        </Typography>
                      </TableCell>
                      <TableCell>{formatTime(flight.std)}</TableCell>
                      <TableCell>{formatTime(flight.etd)}</TableCell>
                      <TableCell>{formatTime(flight.atd)}</TableCell>
                      <TableCell>{flight.category}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          className="status-button"
                          sx={{
                            backgroundColor: getStatusColor(flight.status),
                            color: 'white',
                            minWidth: '60px',
                            fontSize: '12px',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: getStatusColor(flight.status),
                              opacity: 0.9
                            }
                          }}
                        >
                          {flight.status}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {flight.remarks || '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      해당 조건에 맞는 출항 정보가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default FlightStatusBoard;
