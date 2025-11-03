import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Divider
} from '@mui/material';

const StationFileReport = ({ data, isPrintMode = false }) => {
  const {
    flightNo,
    flightDate,
    aircraftType,
    reg,
    departure,
    arrival,
    sta,
    eta,
    ata,
    classificationDeadline,
    uldInbound,
    workCompletion,
    inspector,
    weather,
    workers,
    specialCargo = [],
    intactUld,
    uldNumber,
    cargoSummary = {},
    specialNotes = '',
    stld = '',
    ovcd = '',
    dmv = ''
  } = data;

  // flightDate를 분해하여 월 약어로 변환
  const parseFlightDate = (dateStr) => {
    if (dateStr && dateStr.length === 8) {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return { year, month, day };
    }
    return { year: '', month: '', day: '' };
  };

  const getMonthAbbreviation = (month) => {
    const months = {
      '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR',
      '05': 'MAY', '06': 'JUN', '07': 'JUL', '08': 'AUG',
      '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC'
    };
    return months[month] || month;
  };

  const parsedDate = parseFlightDate(flightDate);
  const monthAbbr = getMonthAbbreviation(parsedDate.month);
  const flightDateFormatted = `${parsedDate.day}${monthAbbr}`;

  const reportStyles = {
    container: {
      padding: isPrintMode ? '10px' : '15px',
      maxWidth: '210mm',
      margin: '0 auto',
      backgroundColor: '#ffffcc', // 노란색 배경
      fontFamily: 'Arial, sans-serif',
      fontSize: isPrintMode ? '10px' : '11px',
      lineHeight: 1.1,
      minHeight: '297mm'
    },
    header: {
      textAlign: 'center',
      marginBottom: '15px',
      borderBottom: '2px solid #000',
      paddingBottom: '10px'
    },
    title: {
      fontSize: isPrintMode ? '18px' : '20px',
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    date: {
      fontSize: isPrintMode ? '10px' : '11px',
      color: '#000',
      fontWeight: 'bold',
      textAlign: 'right'
    },
    section: {
      marginBottom: '10px'
    },
    sectionTitle: {
      fontSize: isPrintMode ? '10px' : '11px',
      fontWeight: 'bold',
      marginBottom: '5px',
      backgroundColor: '#f0f0f0',
      padding: '2px 4px',
      border: '1px solid #000',
      textAlign: 'center'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '8px',
      fontSize: isPrintMode ? '8px' : '9px'
    },
    tableHeader: {
      backgroundColor: '#f0f0f0',
      fontWeight: 'bold',
      border: '1px solid #000',
      padding: '2px 4px',
      textAlign: 'center',
      fontSize: isPrintMode ? '7px' : '8px'
    },
    tableCell: {
      border: '1px solid #000',
      padding: '2px 4px',
      textAlign: 'center',
      fontSize: isPrintMode ? '7px' : '8px',
      backgroundColor: '#ffffcc'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '4px',
      marginBottom: '10px'
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column'
    },
    infoLabel: {
      fontSize: isPrintMode ? '7px' : '8px',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '1px',
      textAlign: 'center'
    },
    infoValue: {
      fontSize: isPrintMode ? '8px' : '9px',
      fontWeight: 'bold',
      padding: '2px',
      border: '1px solid #000',
      backgroundColor: '#ffffcc',
      textAlign: 'center',
      minHeight: '16px'
    },
    specialCargo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '2px',
      marginBottom: '8px'
    },
    cargoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      fontSize: isPrintMode ? '7px' : '8px',
      padding: '1px'
    },
    checkbox: {
      width: '8px',
      height: '8px',
      border: '1px solid #000',
      display: 'inline-block',
      marginRight: '2px'
    },
    checkedBox: {
      width: '8px',
      height: '8px',
      border: '1px solid #000',
      backgroundColor: '#000',
      display: 'inline-block',
      marginRight: '2px'
    },
    notes: {
      backgroundColor: '#ffffcc',
      border: '1px solid #000',
      padding: '4px',
      whiteSpace: 'pre-line',
      minHeight: '40px',
      fontSize: isPrintMode ? '7px' : '8px'
    },
    twoColumn: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '10px'
    },
    statusTable: {
      width: 'auto',
      borderCollapse: 'collapse',
      marginBottom: '8px',
      fontSize: isPrintMode ? '7px' : '8px'
    },
    ynCheckbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '1px',
      fontSize: isPrintMode ? '7px' : '8px'
    }
  };

  return (
    <Box sx={reportStyles.container}>
      {/* 헤더 */}
      <Box sx={reportStyles.header}>
        <Typography sx={reportStyles.title}>STATION FILE</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>담당 검수</Typography>
            <Typography sx={{ fontSize: '9px', fontWeight: 'bold', mt: 0.5 }}>{inspector}</Typography>
            <Typography sx={{ fontSize: '8px', fontWeight: 'bold', mt: 0.5 }}>팀장</Typography>
          </Box>
          <Typography sx={reportStyles.date}>
            {new Date().toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </Typography>
        </Box>
      </Box>

      {/* 항공편 정보 - 사진과 동일한 배치 */}
      <Box sx={reportStyles.section}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0px', marginBottom: '0px' }}>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>FLT/DATE</Typography>
            <Typography sx={reportStyles.infoValue}>{flightNo}/{flightDateFormatted}</Typography>
          </Box>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>기종</Typography>
            <Typography sx={reportStyles.infoValue}>{aircraftType}</Typography>
          </Box>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>REG</Typography>
            <Typography sx={reportStyles.infoValue}>{reg}</Typography>
          </Box>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>ROUTE</Typography>
            <Typography sx={reportStyles.infoValue}>{departure}-{arrival}</Typography>
          </Box>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>STA</Typography>
            <Typography sx={reportStyles.infoValue}>{sta}</Typography>
          </Box>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>ETA</Typography>
            <Typography sx={reportStyles.infoValue}>{eta}</Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '2px', marginBottom: '8px' }}>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>ATA</Typography>
            <Typography sx={reportStyles.infoValue}>{ata}</Typography>
          </Box>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>분류마감</Typography>
            <Typography sx={reportStyles.infoValue}>{classificationDeadline}</Typography>
          </Box>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>ULD입고</Typography>
            <Typography sx={reportStyles.infoValue}>{uldInbound}</Typography>
          </Box>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>작업완료</Typography>
            <Typography sx={reportStyles.infoValue}>{workCompletion}</Typography>
          </Box>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>날씨</Typography>
            <Typography sx={reportStyles.infoValue}>{weather}</Typography>
          </Box>
          <Box sx={reportStyles.infoItem}>
            <Typography sx={reportStyles.infoLabel}>작업인원</Typography>
            <Typography sx={reportStyles.infoValue}>{workers}</Typography>
          </Box>
        </Box>
        
        {/* Y/N 체크박스 - ATA 아래에 배치 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, mt: 1 }}>
          <Box sx={reportStyles.ynCheckbox}>
            <Box sx={reportStyles.checkedBox}></Box>
            <Typography>Y</Typography>
          </Box>
          <Box sx={reportStyles.ynCheckbox}>
            <Box sx={reportStyles.checkbox}></Box>
            <Typography>N</Typography>
          </Box>
        </Box>
      </Box>

      {/* ULD CONTROL과 SPECIAL CGO Handling Detail - 2컬럼 레이아웃 */}
      <Box sx={reportStyles.twoColumn}>
        {/* ULD CONTROL */}
        <Box>
          <Typography sx={reportStyles.sectionTitle}>ULD CONTROL</Typography>
          <Table sx={reportStyles.table}>
            <TableHead>
              <TableRow>
                <TableCell sx={reportStyles.tableHeader}>구분</TableCell>
                <TableCell sx={reportStyles.tableHeader}>OWN</TableCell>
                <TableCell sx={reportStyles.tableHeader}>RENTAL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {['10/16/20FT', 'PMC', 'PAG/PAJ', 'PYB', 'AMX/AMJ', 'LD6', 'LD3', 'BLK NO'].map((type) => (
                <TableRow key={type}>
                  <TableCell sx={reportStyles.tableCell}>{type}</TableCell>
                  <TableCell sx={reportStyles.tableCell}></TableCell>
                  <TableCell sx={reportStyles.tableCell}></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* SPECIAL CGO Handling Detail */}
        <Box>
          <Typography sx={reportStyles.sectionTitle}>SPECIAL CGO Handling Detail</Typography>
          <Box sx={reportStyles.specialCargo}>
            {['DIP', 'AVI', 'HUM', 'PER', 'ICE', 'PEF', 'PEN', 'SEN', 'WAS'].map((cargo) => (
              <Box key={cargo} sx={reportStyles.cargoItem}>
                <Box sx={specialCargo.includes(cargo) ? reportStyles.checkedBox : reportStyles.checkbox}></Box>
                <Typography sx={{ fontSize: '7px' }}>{cargo}</Typography>
              </Box>
            ))}
            {['DG', 'VAL', 'EXP', 'MAIL', 'PIL', 'COL', 'PES', '기타'].map((cargo) => (
              <Box key={cargo} sx={reportStyles.cargoItem}>
                <Box sx={specialCargo.includes(cargo) ? reportStyles.checkedBox : reportStyles.checkbox}></Box>
                <Typography sx={{ fontSize: '7px' }}>{cargo}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* INTACT ULD / SEALING 확인 */}
      <Box sx={reportStyles.section}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>SEALING 확인</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Box sx={reportStyles.checkbox}></Box>
              <Typography sx={{ fontSize: '7px' }}>Y</Typography>
              <Box sx={reportStyles.checkbox}></Box>
              <Typography sx={{ fontSize: '7px' }}>N</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>INTACT ULD</Typography>
            <Box sx={{
              border: '1px solid #000',
              padding: '1px 3px',
              minHeight: '12px',
              minWidth: '40px',
              backgroundColor: '#ffffcc'
            }}>
              {intactUld || ''}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>ULD NBR</Typography>
          <Box sx={{
            border: '1px solid #000',
            padding: '1px 3px',
            minHeight: '12px',
            minWidth: '150px',
            backgroundColor: '#ffffcc'
          }}>
            {uldNumber || ''}
          </Box>
        </Box>
      </Box>

      {/* 화물 요약 */}
      <Box sx={reportStyles.section}>
        <Table sx={reportStyles.table}>
          <TableHead>
            <TableRow>
              <TableCell sx={reportStyles.tableHeader} colSpan={3}>ICN OFF(DT포함)</TableCell>
              <TableCell sx={reportStyles.tableHeader} colSpan={3}>B/D T/S & TRM</TableCell>
              <TableCell sx={reportStyles.tableHeader} colSpan={3}>MAIL</TableCell>
              <TableCell sx={reportStyles.tableHeader} colSpan={3}>TTL(T/S포함)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={reportStyles.tableHeader}>건수</TableCell>
              <TableCell sx={reportStyles.tableHeader}>PC</TableCell>
              <TableCell sx={reportStyles.tableHeader}>WT</TableCell>
              <TableCell sx={reportStyles.tableHeader}>건수</TableCell>
              <TableCell sx={reportStyles.tableHeader}>PC</TableCell>
              <TableCell sx={reportStyles.tableHeader}>WT</TableCell>
              <TableCell sx={reportStyles.tableHeader}>건수</TableCell>
              <TableCell sx={reportStyles.tableHeader}>PC</TableCell>
              <TableCell sx={reportStyles.tableHeader}>WT</TableCell>
              <TableCell sx={reportStyles.tableHeader}>건수</TableCell>
              <TableCell sx={reportStyles.tableHeader}>PC</TableCell>
              <TableCell sx={reportStyles.tableHeader}>WT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={reportStyles.tableCell}>{cargoSummary.icnOff?.count || ''}</TableCell>
              <TableCell sx={reportStyles.tableCell}>{cargoSummary.icnOff?.pieces || ''}</TableCell>
              <TableCell sx={reportStyles.tableCell}>{cargoSummary.icnOff?.weight?.toLocaleString() || ''}</TableCell>
              <TableCell sx={reportStyles.tableCell}></TableCell>
              <TableCell sx={reportStyles.tableCell}></TableCell>
              <TableCell sx={reportStyles.tableCell}></TableCell>
              <TableCell sx={reportStyles.tableCell}>{cargoSummary.mail?.count || ''}</TableCell>
              <TableCell sx={reportStyles.tableCell}>{cargoSummary.mail?.pieces || ''}</TableCell>
              <TableCell sx={reportStyles.tableCell}>{cargoSummary.mail?.weight?.toLocaleString() || ''}</TableCell>
              <TableCell sx={{...reportStyles.tableCell, fontWeight: 'bold'}}>{cargoSummary.total?.count || ''}</TableCell>
              <TableCell sx={{...reportStyles.tableCell, fontWeight: 'bold'}}>{cargoSummary.total?.pieces || ''}</TableCell>
              <TableCell sx={{...reportStyles.tableCell, fontWeight: 'bold'}}>{cargoSummary.total?.weight?.toLocaleString() || ''}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* T/S / TRM Detail 및 특이사항 */}
      <Box sx={reportStyles.twoColumn}>
        <Box>
          <Typography sx={reportStyles.sectionTitle}>T/S / TRM Detail</Typography>
          <Box sx={reportStyles.notes}>
            {/* T/S / TRM Detail 내용 */}
          </Box>
        </Box>
        <Box>
          <Typography sx={reportStyles.sectionTitle}>작업시 특이사항</Typography>
          <Box sx={reportStyles.notes}>
            {specialNotes}
          </Box>
        </Box>
      </Box>

      {/* STLD, OVCD, DMG/V/T */}
      <Box sx={reportStyles.section}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Table sx={reportStyles.statusTable}>
            <TableHead>
              <TableRow>
                <TableCell sx={reportStyles.tableHeader}></TableCell>
                <TableCell sx={reportStyles.tableHeader}>STLD</TableCell>
                <TableCell sx={reportStyles.tableHeader}>OVCD</TableCell>
                <TableCell sx={reportStyles.tableHeader}>DMG/W/T</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={reportStyles.tableCell}>I</TableCell>
                <TableCell sx={reportStyles.tableCell}></TableCell>
                <TableCell sx={reportStyles.tableCell}></TableCell>
                <TableCell sx={reportStyles.tableCell}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={reportStyles.tableCell}>R</TableCell>
                <TableCell sx={reportStyles.tableCell}></TableCell>
                <TableCell sx={reportStyles.tableCell}></TableCell>
                <TableCell sx={reportStyles.tableCell}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={reportStyles.tableCell}>R</TableCell>
                <TableCell sx={reportStyles.tableCell}></TableCell>
                <TableCell sx={reportStyles.tableCell}></TableCell>
                <TableCell sx={reportStyles.tableCell}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default StationFileReport;
