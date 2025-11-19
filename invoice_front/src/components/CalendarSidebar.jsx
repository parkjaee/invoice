import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import TerminalSelect from './common/TerminalSelect';
import './CalendarSidebar.css';

const CalendarSidebar = ({ selectedDate, onDateSelect, selectedFlight, onFlightSelect, isExpanded: externalIsExpanded, onExpandedChange }) => {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [flights, setFlights] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tradeType, setTradeType] = useState('import'); // 'import' 또는 'export'
  const [selectedTerminal, setSelectedTerminal] = useState('all'); // 'all', 'T1', 'T2', 'T3'
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', '작성완료', '작성중', '미작성'
  const [sortBy, setSortBy] = useState('time'); // 'time', 'flightNo', 'terminal'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // 정렬 함수
  const sortFlights = (flights, sortBy, sortOrder) => {
    const sorted = [...flights].sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'time':
          // 시간을 HH:mm 형식에서 분 단위로 변환하여 비교
          const timeA = a.time.split(':').map(Number);
          const timeB = b.time.split(':').map(Number);
          const minutesA = timeA[0] * 60 + timeA[1];
          const minutesB = timeB[0] * 60 + timeB[1];
          comparison = minutesA - minutesB;
          break;
        case 'flightNo':
          comparison = a.flightNo.localeCompare(b.flightNo);
          break;
        case 'terminal':
          comparison = a.terminal.localeCompare(b.terminal);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  };

  // 선택된 날짜, 수입/수출 타입, 터미널, 작성 상태, 정렬 기준에 따라 Flight 목록 가져오기
  useEffect(() => {
    if (selectedDate) {
      fetchFlightsForDate(selectedDate);
    } else {
      setFlights([]);
    }
  }, [selectedDate, tradeType, selectedTerminal, selectedStatus, sortBy, sortOrder]);

  const fetchFlightsForDate = async (date) => {
    try {
      // TODO: 백엔드 API 호출로 변경
      // const response = await axios.get(`/api/flights?date=${date.format('YYYY-MM-DD')}&tradeType=${tradeType}`);
      // setFlights(response.data);
      
      // Mock 데이터 - 날짜와 수입/수출 타입에 따라 다른 Flight 목록 반환
      const dateStr = date.format('YYYY-MM-DD');
      const allFlights = [
        { id: 1, flightNo: 'SQ601', terminal: 'T1', time: '23:36', type: 'arrival', date: dateStr, tradeType: 'import', departure: 'ALA', arrival: 'ICN', status: '작성완료' },
        { id: 2, flightNo: 'TR501', terminal: 'T2', time: '14:25', type: 'departure', date: dateStr, tradeType: 'export', departure: 'ICN', arrival: 'NRT', status: '작성중' },
        { id: 3, flightNo: 'TG652', terminal: 'T2', time: '08:15', type: 'arrival', date: dateStr, tradeType: 'import', departure: 'NRT', arrival: 'ICN', status: '미작성' },
        { id: 4, flightNo: 'TW126', terminal: 'T2', time: '16:30', type: 'departure', date: dateStr, tradeType: 'export', departure: 'ICN', arrival: 'NRT', status: '작성완료' },
        { id: 5, flightNo: 'SQ603', terminal: 'T1', time: '20:45', type: 'arrival', date: dateStr, tradeType: 'import', departure: 'NRT', arrival: 'ICN', status: '작성중' },
        { id: 6, flightNo: 'KE501', terminal: 'T1', time: '10:30', type: 'departure', date: dateStr, tradeType: 'export', departure: 'ICN', arrival: 'NRT', status: '미작성' },
        { id: 7, flightNo: 'KE502', terminal: 'T3', time: '12:00', type: 'arrival', date: dateStr, tradeType: 'import', departure: 'LAX', arrival: 'ICN', status: '작성완료' },
      ];
      
      // 선택된 수입/수출 타입, 터미널, 작성 상태에 맞는 Flight만 필터링
      let filteredFlights = allFlights.filter(flight => flight.tradeType === tradeType);
      if (selectedTerminal !== 'all') {
        filteredFlights = filteredFlights.filter(flight => flight.terminal === selectedTerminal);
      }
      if (selectedStatus !== 'all') {
        filteredFlights = filteredFlights.filter(flight => flight.status === selectedStatus);
      }
      
      // 정렬 적용
      const sortedFlights = sortFlights(filteredFlights, sortBy, sortOrder);
      setFlights(sortedFlights);
    } catch (error) {
      console.error('Flight 목록 조회 실패:', error);
      setFlights([]);
    }
  };

  const handleMouseEnter = () => {
    if (onExpandedChange) {
      onExpandedChange(true);
    } else {
      setInternalIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (onExpandedChange) {
      onExpandedChange(false);
    } else {
      setInternalIsExpanded(false);
    }
  };

  const handleDateClick = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleFlightClick = (flight) => {
    if (onFlightSelect) {
      onFlightSelect(flight);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const handleToday = () => {
    const today = dayjs();
    setCurrentMonth(today);
    if (onDateSelect) {
      onDateSelect(today);
    }
  };

  // 캘린더 그리드 생성
  const getCalendarDays = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startOfCalendar = startOfMonth.startOf('week');
    const endOfCalendar = endOfMonth.endOf('week');
    
    const days = [];
    let currentDay = startOfCalendar;
    
    while (currentDay.isBefore(endOfCalendar) || currentDay.isSame(endOfCalendar)) {
      days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div
      className={`calendar-sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="calendar-sidebar-content">
        {isExpanded && (
          <>
            {/* 수입/수출 선택 버튼 */}
            <div className="trade-type-selector">
              <button
                className={`trade-type-button ${tradeType === 'import' ? 'active' : ''}`}
                onClick={() => setTradeType('import')}
              >
                수입
              </button>
              <button
                className={`trade-type-button ${tradeType === 'export' ? 'active' : ''}`}
                onClick={() => setTradeType('export')}
              >
                수출
              </button>
            </div>

            {/* 터미널 및 작성 상태 필터 */}
            <div className="filter-row">
              <TerminalSelect
                value={selectedTerminal}
                onChange={(e) => setSelectedTerminal(e.target.value)}
                label=""
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    fontSize: '12px',
                    padding: '6px 10px',
                    height: 'auto'
                  },
                  '& .MuiInputLabel-root': {
                    display: 'none'
                  }
                }}
              />
              <select
                className="status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="작성완료">작성완료</option>
                <option value="작성중">작성중</option>
                <option value="미작성">미작성</option>
              </select>
            </div>

            {/* 캘린더 헤더 */}
            <div className="calendar-header">
              <button className="calendar-nav-button" onClick={handlePrevMonth}>
                ‹
              </button>
              <div className="calendar-month">
                {currentMonth.format('YYYY년 MM월')}
              </div>
              <button className="calendar-nav-button" onClick={handleNextMonth}>
                ›
              </button>
            </div>
            <button className="calendar-today-button" onClick={handleToday}>
              오늘
            </button>

            {/* 캘린더 그리드 */}
            <div className="calendar-grid">
              {weekdays.map((day) => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}
              {calendarDays.map((day) => {
                const isToday = day.isSame(dayjs(), 'day');
                const isSelected = selectedDate && day.isSame(selectedDate, 'day');
                const isOtherMonth = !day.isSame(currentMonth, 'month');
                // 선택된 날짜와 같은 날짜인 경우에만 hasFlights 표시
                const hasFlights = isSelected && flights.length > 0;

                return (
                  <div
                    key={day.format('YYYY-MM-DD')}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isOtherMonth ? 'other-month' : ''} ${hasFlights ? 'has-flights' : ''}`}
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {day.format('D')}
                  </div>
                );
              })}
            </div>

            {/* Flight 목록 */}
            {selectedDate && (
              <div className="flight-list-container">
                <div className="flight-list-header">
                  <div className="flight-list-title">Flight 편번 목록</div>
                  <div className="flight-sort-controls">
                    <select
                      className="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="time">시간</option>
                      <option value="flightNo">편번명</option>
                      <option value="terminal">터미널</option>
                    </select>
                    <button
                      className="sort-order-button"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      title={sortOrder === 'asc' ? '오름차순' : '내림차순'}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
                <div className="flight-list">
                  {flights.length > 0 ? (
                    flights.map((flight) => {
                      // 수입일 경우 출발지, 수출일 경우 도착지 표시
                      const location = tradeType === 'import' ? flight.departure : flight.arrival;
                      
                      // 작성 상태에 따른 색상
                      const getStatusColor = (status) => {
                        switch(status) {
                          case '작성완료': return '#4caf50';
                          case '작성중': return '#ff9800';
                          case '미작성': return '#f44336';
                          default: return '#999';
                        }
                      };

                      return (
                        <div
                          key={flight.id}
                          className={`flight-item ${selectedFlight?.id === flight.id ? 'selected' : ''}`}
                          onClick={() => handleFlightClick(flight)}
                        >
                          <div className="flight-item-line">
                            <span className="flight-terminal">{flight.terminal}</span>
                            <span className="flight-separator">|</span>
                            <span className="flight-time">{flight.time}</span>
                            <span className="flight-separator">|</span>
                            <span className="flight-number">{flight.flightNo}</span>
                            <span className="flight-separator">|</span>
                            <span className="flight-location">{location}</span>
                            <span className="flight-separator">|</span>
                            <span 
                              className="flight-status-badge"
                              style={{ backgroundColor: getStatusColor(flight.status) }}
                            >
                              {flight.status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flight-list-empty">해당 날짜에 Flight가 없습니다.</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarSidebar;

