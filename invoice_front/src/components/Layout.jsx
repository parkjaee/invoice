import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Fullscreen,
  AccountCircle,
  Edit as EditIcon,
  Logout as LogoutIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import CalendarSidebar from './CalendarSidebar';
import FlightStatusBoard from './FlightStatusBoard';
import headerLogo from '../assets/images/header_logo.png';
import dayjs from 'dayjs';
import './Layout.css';

const menuItems = [
  {
    text: '관리항목',
    icon: <SettingsIcon />,
    children: [
      { text: '스테이션파일관리', path: '/station-files' },
      { text: 'CAPS 사용자 관리', path: '/caps/users' },
      { text: '근무현황표', path: '/work-status' },
      { text: '운항현황판', path: '/flight-status', isFlightStatus: true }
    ]
  }
];

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [openMenus, setOpenMenus] = useState({});
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [isFlightStatusOpen, setIsFlightStatusOpen] = useState(false);
  const [flightStatusDate, setFlightStatusDate] = useState(dayjs());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  const handleMenuToggle = (menuText) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuText]: !prev[menuText]
    }));
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleProfileEdit = () => {
    console.log('프로필 수정');
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    console.log('로그아웃');
    handleProfileMenuClose();
  };

  const handleNavigation = (path, isFlightStatus = false) => {
    if (isFlightStatus) {
      // 운항현황판 메뉴 클릭 시 패널 열기
      setIsFlightStatusOpen(true);
      setFlightStatusDate(selectedDate);
    } else {
      // 다른 화면으로 이동 시 운항현황판 자동 접힘
      setIsFlightStatusOpen(false);
      navigate(path);
    }
  };

  // 라우트 변경 감지하여 운항현황판 자동 접힘
  // (직접 URL 입력이나 브라우저 뒤로가기 등으로 다른 화면으로 이동 시 자동 접힘)
  const prevPathnameRef = React.useRef(location.pathname);
  useEffect(() => {
    // 경로가 변경되었고, 운항현황판이 열려있으면 접힘
    if (prevPathnameRef.current !== location.pathname && isFlightStatusOpen) {
      setIsFlightStatusOpen(false);
    }
    prevPathnameRef.current = location.pathname;
  }, [location.pathname, isFlightStatusOpen]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedFlight(null);
    // 운항현황판이 열려있을 때만 날짜 동기화
    if (isFlightStatusOpen) {
      setFlightStatusDate(date);
    }
  };

  const handleFlightStatusClose = () => {
    setIsFlightStatusOpen(false);
  };

  const handleFlightStatusButtonClick = () => {
    setIsFlightStatusOpen(true);
    setFlightStatusDate(selectedDate);
  };

  const handleFlightStatusDateChange = (date) => {
    setFlightStatusDate(date);
    // 운항현황판 날짜 변경 시 캘린더 날짜도 동기화 (선택사항)
    // setSelectedDate(date);
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    // 현재 경로에 따라 다르게 처리
    if (location.pathname === '/station-files') {
      // 스테이션 파일 화면: 이벤트를 통해 상위 컴포넌트에 전달
      window.dispatchEvent(new CustomEvent('flightSelected', { detail: flight }));
    } else if (location.pathname === '/work-status') {
      // 근무현황판: 이벤트를 통해 필터링만 처리
      window.dispatchEvent(new CustomEvent('flightSelected', { detail: flight }));
    } else {
      // 다른 화면: 스테이션 파일로 이동
      navigate('/station-files', { state: { flight } });
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isChildActive = (children) => {
    return children.some(child => location.pathname === child.path);
  };

  return (
    <Box className="layout-container">
      <CssBaseline />
      
      {/* 헤더 */}
      <AppBar 
        position="static" 
        className="header-container"
        sx={{ 
          backgroundColor: '#1E1F2A',
          flexDirection: 'row',   
          alignItems: 'start',       
          justifyContent: 'space-between' 
        }}
      >
        <Box className="header-logo">
          <img src={headerLogo} alt="" height={42} width={62}/>
        </Box>
        <Box className="header-menu-container">
          <Box className="header-menu">
            {menuItems.map((item, index) => {
              const hasActiveChild = item.children && isChildActive(item.children);
              return (
                <Box 
                  key={index} 
                  className="header-menu-item"
                  onMouseEnter={() => {
                    if (item.children && !openMenus[item.text]) {
                      handleMenuToggle(item.text);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.children && openMenus[item.text]) {
                      handleMenuToggle(item.text);
                    }
                  }}
                >
                  <button
                    className={`header-menu-button ${hasActiveChild ? 'active' : ''}`}
                  >
                    {item.icon}
                    {item.text}
                  </button>
                  {openMenus[item.text] && item.children && (
                    <Box 
                      className="header-menu-dropdown"
                      onMouseEnter={() => {
                        if (!openMenus[item.text]) {
                          handleMenuToggle(item.text);
                        }
                      }}
                    >
                      {item.children.map((child, childIndex) => (
                        <div
                          key={childIndex}
                          className={`header-menu-dropdown-item ${isActive(child.path) ? 'active' : ''}`}
                          onClick={() => {
                            handleNavigation(child.path, child.isFlightStatus);
                          }}
                        >
                          {child.text}
                        </div>
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box className="header-user-container">
          <IconButton 
            color="inherit" 
            className="header-icon-button"
            onClick={handleProfileMenuOpen}
            aria-controls={profileAnchorEl ? 'profile-menu' : undefined}
            aria-haspopup="true"
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </AppBar>
      
      {/* 프로필 메뉴 */}
      <Menu
        id="profile-menu"
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          zIndex: 1400
        }}
      >
        <MenuItem onClick={handleProfileEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>프로필 수정</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>로그아웃</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* 컨텐츠 래퍼 (사이드바 + 메인 컨텐츠) */}
      <Box className="layout-content-wrapper">
        {/* 좌측 캘린더 사이드바 */}
        <CalendarSidebar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          selectedFlight={selectedFlight}
          onFlightSelect={handleFlightSelect}
          isExpanded={isCalendarExpanded}
          onExpandedChange={setIsCalendarExpanded}
        />
        
        {/* 메인 컨텐츠 영역 */}
        <Box className="main-content">
          {children}
        </Box>
      </Box>

      {/* 운항현황판 접이식 패널 */}{/*
      {isFlightStatusOpen ? (
        <FlightStatusBoard
          isOpen={isFlightStatusOpen}
          onClose={handleFlightStatusClose}
          selectedDate={flightStatusDate}
          onDateChange={handleFlightStatusDateChange}
          isCalendarExpanded={isCalendarExpanded}
        />
      ) : (
        <button
          className="flight-status-board-button"
          onClick={handleFlightStatusButtonClick}
          title="운항현황판 열기"
        >
          <span>운항현황판</span>
        </button>
      )}
      */}
    </Box>
  );
}

export default Layout;
