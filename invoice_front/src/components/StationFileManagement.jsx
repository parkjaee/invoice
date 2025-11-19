import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Save as SaveIcon,
  FileDownload as ExcelIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  FlightTakeoff as DepartureIcon,
  FlightLand as ArrivalIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import DatePicker from './common/DatePicker';
import AirlineSelect from './common/AirlineSelect';
import StationFileReport from './StationFileReport';
import { usePDF } from 'react-to-pdf';

// Mock 데이터 - 수입 스테이션파일 리스트
const mockStationFiles = [
  {
    id: 1,
    terminal: 'T1',
    time: '23:36',
    flight: 'SQ601',
    departure: 'ALA',
    arrival: 'ICN',
    status: '작성완료',
    type: 'arrival',
    date: '2023-12-29',
    airline: 'SIA',
    flightDate: '20250101'
  },
  {
    id: 2,
    terminal: 'T2',
    time: '14:25',
    flight: 'TR501',
    departure: 'ICN',
    arrival: 'NRT',
    status: '작성중',
    type: 'departure',
    date: '2023-12-30',
    airline: 'TGW',
    flightDate: '20250102'
  },
  {
    id: 3,
    terminal: 'T2',
    time: '08:15',
    flight: 'TG652',
    departure: 'NRT',
    arrival: 'ICN',
    status: '미작성',
    type: 'arrival',
    date: '2023-12-30',
    airline: 'THA',
    flightDate: '20250102'
  },
  {
    id: 4,
    terminal: 'T2',
    time: '16:30',
    flight: 'TW126',
    departure: 'ICN',
    arrival: 'NRT',
    status: '작성완료',
    type: 'departure',
    date: '2023-12-29',
    airline: 'TWB',
    flightDate: '20250101'
  },
  {
    id: 5,
    terminal: 'T1',
    time: '20:45',
    flight: 'SQ603',
    departure: 'NRT',
    arrival: 'ICN',
    status: '작성중',
    type: 'arrival',
    date: '2023-12-29',
    airline: 'SIA',
    flightDate: '20250101'
  }
];

// 항공사 목록 (공통 컴포넌트에서 "전체" 옵션 자동 포함)
const airlines = [
  { code: 'SIA', name: 'SQ항공' },
  { code: 'THA', name: 'TG항공' },
  { code: 'TWB', name: 'TW항공' },
  { code: 'TGW', name: 'TR항공' }
];

// Mock 데이터 - 수입 스테이션파일 상세
const mockStationFileDetail = {
  flightNo: 'SQ601',
  flightDate: '20250101',
  aircraftType: 'B763',
  reg: 'GDHLE',
  departure: 'ALA',
  arrival: 'ICN',
  sta: '23:55',
  eta: '23:44',
  ata: '23:36',
  classificationDeadline: '00:07',
  uldInbound: '00:20',
  workCompletion: '01:30',
  inspector: '윤태일',
  weather: '맑음',
  workers: 5,
  specialCargo: ['DIP', 'DG', 'AVI', 'VAL'],
  intactUld: '',
  uldNumber: '',
  cargoSummary: {
    icnOff: { count: 1, pieces: 4, weight: 1176.0 },
    mail: { count: 2, pieces: 2, weight: 2501.8 },
    total: { count: 3, pieces: 6, weight: 3677.8 }
  },
  specialNotes: 'NO MFST\nMAIL 2건(AAX1849DHL, AAX1500DHL)',
  stld: '',
  ovcd: '',
  dmv: ''
};

// 특별화물 옵션
const specialCargoOptions = [
  'DIP', 'DG', 'AVI', 'VAL', 'HUM', 'EXP', 'PER', 'MAIL',
  'ICE', 'PIL', 'PEF', 'COL', 'PEN', 'PES', 'SEN', '기타', 'WAS'
];

// 월을 영어 약어로 변환하는 함수
const getMonthAbbreviation = (month) => {
  const months = {
    '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR',
    '05': 'MAY', '06': 'JUN', '07': 'JUL', '08': 'AUG',
    '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC'
  };
  return months[month] || month;
};

// flightDate를 분해하는 함수
const parseFlightDate = (flightDate) => {
  if (flightDate && flightDate.length === 8) {
    const year = flightDate.substring(0, 4);
    const month = flightDate.substring(4, 6);
    const day = flightDate.substring(6, 8);
    return { year, month, day };
  }
  return { year: '', month: '', day: '' };
};

function StationFileManagement() {
  const [selectedType, setSelectedType] = useState('arrival');
  const [stationFiles, setStationFiles] = useState(mockStationFiles);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [formData, setFormData] = useState(mockStationFileDetail);
  const [selectedDate, setSelectedDate] = useState(dayjs('2023-12-29'));
  const [selectedAirline, setSelectedAirline] = useState('all');
  const [showReport, setShowReport] = useState(false);

  const { toPDF, targetRef } = usePDF({
    filename: `station-file-${formData.flightNo}-${formData.flightDate}.pdf`,
    page: {
      margin: 20,
      format: 'a4',
      orientation: 'portrait'
    }
  });

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setSelectedType(newType);
      setSelectedFile(null);
      setShowDetail(false);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    
    setFormData({
      ...mockStationFileDetail,
      flightNo: file.flight,
      flightDate: file.flightDate || '20250101',
      departure: file.departure,
      arrival: file.arrival
    });
    setShowDetail(true);
  };

  // Flight 편번 클릭 이벤트 리스너
  React.useEffect(() => {
    const handleFlightSelect = (event) => {
      const flight = event.detail;
      // 해당 편번의 스테이션 파일 찾기
      const stationFile = stationFiles.find(
        file => file.flight === flight.flightNo
      );
      if (stationFile) {
        handleFileSelect(stationFile);
      }
    };

    window.addEventListener('flightSelected', handleFlightSelect);
    return () => {
      window.removeEventListener('flightSelected', handleFlightSelect);
    };
  }, [stationFiles]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSpecialCargoChange = (cargo) => {
    setFormData(prev => ({
      ...prev,
      specialCargo: prev.specialCargo.includes(cargo)
        ? prev.specialCargo.filter(item => item !== cargo)
        : [...prev.specialCargo, cargo]
    }));
  };

  const handleShowReport = () => {
    setShowReport(true);
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    toPDF();
  };

  const handleSave = () => {
    // flightDate에서 월과 일 추출
    const parsedDate = parseFlightDate(formData.flightDate);
    const monthAbbr = getMonthAbbreviation(parsedDate.month);
    
    // FLT_NO와 변환된 날짜를 합쳐서 FLT/DATE 형태로 변환
    const flightDateFormatted = `${parsedDate.day}${monthAbbr}`;
    const flightDateCombined = `${formData.flightNo}/${flightDateFormatted}`;
    
    // 출발지와 도착지를 합쳐서 ROUTE 형태로 변환
    const routeCombined = `${formData.departure}-${formData.arrival}`;
    
    const saveData = {
      ...formData,
      flightDateFormatted, // 01JAN 형태
      flightDateCombined,  // SQ601/01JAN 형태 (백엔드 전송용)
      routeCombined,       // ALA-ICN 형태 (백엔드 전송용)
      monthAbbreviation: monthAbbr // JAN, FEB 등
    };
    
    // 저장 로직
    console.log('저장:', saveData);
    console.log('FLT/DATE:', saveData.flightDateCombined);
    console.log('ROUTE:', saveData.routeCombined);
    console.log('월 약어:', saveData.monthAbbreviation);
    setShowDetail(false);
  };

  const filteredFiles = stationFiles.filter(file => {
    const matchesType = file.type === selectedType;
    const matchesDate = file.date === selectedDate.format('YYYY-MM-DD');
    const matchesAirline = selectedAirline === 'all' || file.airline === selectedAirline;
    
    return matchesType && matchesDate && matchesAirline;
  });

  return (
    <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 120px)' }}>
      {/* 왼쪽 리스트 영역 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">스테이션파일 관리</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<SearchIcon />}>검색</Button>
              <Button variant="contained" startIcon={<AddIcon />}>신규</Button>
              <Button variant="outlined" startIcon={<SaveIcon />}>저장</Button>
              <Button variant="outlined" startIcon={<ExcelIcon />}>엑셀다운로드</Button>
              <Button variant="outlined" startIcon={<RefreshIcon />}>새로고침</Button>
            </Box>
          </Box>

          {/* 필터 영역 */}
          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* 출항/입항 선택 */}
            <ToggleButtonGroup
              value={selectedType}
              exclusive
              onChange={handleTypeChange}
              aria-label="flight type"
            >
              <ToggleButton value="arrival" aria-label="arrival">
                <ArrivalIcon sx={{ mr: 1 }} />
                입항편
              </ToggleButton>
              <ToggleButton value="departure" aria-label="departure">
                <DepartureIcon sx={{ mr: 1 }} />
                출항편
              </ToggleButton>
            </ToggleButtonGroup>

            {/* 날짜 선택 */}
            <DatePicker
              label="날짜 선택"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
            />

            {/* 항공사 선택 */}
            <AirlineSelect
              value={selectedAirline}
              onChange={(e) => setSelectedAirline(e.target.value)}
              airlines={airlines.length > 0 ? airlines : null}
              sx={{ minWidth: 150 }}
            />
          </Box>

          {/* 테이블 */}
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">#</TableCell>
                  <TableCell>순번</TableCell>
                  <TableCell>터미널</TableCell>
                  <TableCell>시간</TableCell>
                  <TableCell>편명</TableCell>
                  <TableCell>출발지</TableCell>
                  <TableCell>도착지</TableCell>
                  <TableCell>작성여부</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFiles.map((file, index) => (
                  <TableRow
                    key={file.id}
                    hover
                    selected={selectedFile?.id === file.id}
                    onClick={() => handleFileSelect(file)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedFile?.id === file.id ? 'primary.light' : 'inherit',
                      '&:hover': {
                        bgcolor: selectedFile?.id === file.id ? 'primary.light' : 'action.hover'
                      }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedFile?.id === file.id}
                        onChange={() => handleFileSelect(file)}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{file.terminal}</TableCell>
                    <TableCell>{file.time}</TableCell>
                    <TableCell>{file.flight}</TableCell>
                    <TableCell>{file.departure}</TableCell>
                    <TableCell>{file.arrival}</TableCell>
                    <TableCell>
                      <Chip
                        label={file.status}
                        color={
                          file.status === '작성완료' ? 'success' :
                          file.status === '작성중' ? 'warning' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* 오른쪽 상세 정보 영역 */}
      {showDetail && (
        <Box sx={{ width: 600 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">STATION FILE</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">2023.12.29.금요일</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PrintIcon />}
                    onClick={handleShowReport}
                    sx={{ mr: 1 }}
                  >
                    리포트보기
                  </Button>
                  <IconButton onClick={() => setShowDetail(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* 항공편 정보 */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label="FLT_NO"
                    value={formData.flightNo}
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="FLT_DATE"
                    value={formData.flightDate}
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="기종"
                    value={formData.aircraftType}
                    onChange={handleInputChange('aircraftType')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="REG"
                    value={formData.reg}
                    onChange={handleInputChange('reg')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={1.5}>
                  <TextField
                    fullWidth
                    label="출발지"
                    value={formData.departure}
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={1.5}>
                  <TextField
                    fullWidth
                    label="도착지"
                    value={formData.arrival}
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="STA"
                    value={formData.sta}
                    onChange={handleInputChange('sta')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="ETA"
                    value={formData.eta}
                    onChange={handleInputChange('eta')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="ATA"
                    value={formData.ata}
                    onChange={handleInputChange('ata')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Checkbox size="small" />
                    <Typography variant="body2">Y</Typography>
                    <Checkbox size="small" />
                    <Typography variant="body2">N</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="분류마감"
                    value={formData.classificationDeadline}
                    onChange={handleInputChange('classificationDeadline')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="ULD입고"
                    value={formData.uldInbound}
                    onChange={handleInputChange('uldInbound')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="작업완료"
                    value={formData.workCompletion}
                    onChange={handleInputChange('workCompletion')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="담당검수"
                    value={formData.inspector}
                    onChange={handleInputChange('inspector')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="날씨"
                    value={formData.weather}
                    onChange={handleInputChange('weather')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="작업인원"
                    value={formData.workers}
                    onChange={handleInputChange('workers')}
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* ULD CONTROL */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>ULD CONTROL</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>구분</TableCell>
                      <TableCell>OWN</TableCell>
                      <TableCell>RENTAL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {['10/16/20FT', 'PMC', 'PAG/PAJ', 'PYB', 'AMX/AMJ', 'LD6', 'LD3', 'BLK NO'].map((type) => (
                      <TableRow key={type}>
                        <TableCell>{type}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* SPECIAL CGO Handling Detail */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>SPECIAL CGO Handling Detail</Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  {specialCargoOptions.map((cargo) => (
                    <Grid item xs={3} key={cargo}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          size="small"
                          checked={formData.specialCargo.includes(cargo)}
                          onChange={() => handleSpecialCargoChange(cargo)}
                        />
                        <Typography variant="body2">{cargo}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* INTACT ULD / SEALING 확인 */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>SEALING 확인</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Checkbox size="small" />
                    <Typography variant="body2">Y</Typography>
                    <Checkbox size="small" />
                    <Typography variant="body2">N</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="INTACT ULD"
                    value={formData.intactUld}
                    onChange={handleInputChange('intactUld')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ULD NBR"
                    value={formData.uldNumber}
                    onChange={handleInputChange('uldNumber')}
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* 화물 요약 정보 */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>화물 요약</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>구분</TableCell>
                      <TableCell align="center">건수</TableCell>
                      <TableCell align="center">PC</TableCell>
                      <TableCell align="center">WT</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>ICN OFF (DT포함)</TableCell>
                      <TableCell align="center">{formData.cargoSummary.icnOff.count}</TableCell>
                      <TableCell align="center">{formData.cargoSummary.icnOff.pieces}</TableCell>
                      <TableCell align="center">{formData.cargoSummary.icnOff.weight.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>B/D T/S & TRM</TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>MAIL</TableCell>
                      <TableCell align="center">{formData.cargoSummary.mail.count}</TableCell>
                      <TableCell align="center">{formData.cargoSummary.mail.pieces}</TableCell>
                      <TableCell align="center">{formData.cargoSummary.mail.weight.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>TTL (T/S포함)</strong></TableCell>
                      <TableCell align="center"><strong>{formData.cargoSummary.total.count}</strong></TableCell>
                      <TableCell align="center"><strong>{formData.cargoSummary.total.pieces}</strong></TableCell>
                      <TableCell align="center"><strong>{formData.cargoSummary.total.weight.toLocaleString()}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* T/S / TRM Detail 및 특이사항 */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="T/S / TRM Detail"
                    multiline
                    rows={3}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="작업시 특이사항"
                    value={formData.specialNotes}
                    onChange={handleInputChange('specialNotes')}
                    multiline
                    rows={3}
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* STLD, OVCD, DMG/V/T */}
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell align="center">STLD</TableCell>
                      <TableCell align="center">OVCD</TableCell>
                      <TableCell align="center">DMG/V/T</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>I</TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>R</TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>R</TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => setShowDetail(false)}>
                  취소
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  저장
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* 리포트 모달 */}
      {showReport && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            {/* 리포트 헤더 */}
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                borderBottom: '1px solid #ddd',
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1
              }}
            >
              <Typography variant="h6">스테이션파일 리포트</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={handlePrintReport}
                >
                  인쇄
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PdfIcon />}
                  onClick={handleDownloadPDF}
                >
                  PDF 다운로드
                </Button>
                <IconButton onClick={handleCloseReport}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* 리포트 내용 */}
            <Box sx={{ p: 2 }}>
              <div ref={targetRef}>
                <StationFileReport data={formData} isPrintMode={true} />
              </div>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default StationFileManagement;
