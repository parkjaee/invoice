import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Divider,
  Collapse,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Fullscreen,
  AccountCircle,
  Edit as EditIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
  {
    text: '관리항목',
    icon: <SettingsIcon />,
    children: [
      { text: '스테이션파일관리', path: '/station-files' },
      { text: 'CAPS 사용자 관리', path: '/caps/users' }
    ]
  }
];

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, bgcolor: '#424242', color: 'white' }}>
        <Typography variant="h6" component="div">
          AACT
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            A
          </Avatar>
          <Typography variant="body2">관리자</Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
          MENU
        </Typography>
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => item.children ? handleMenuToggle(item.text) : null}
                  sx={{
                    bgcolor: item.children && openMenus[item.text] ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.children && (
                    openMenus[item.text] ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>
              {item.children && (
                <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child, childIndex) => {
                      const isActive = location.pathname === child.path;
                      return (
                        <ListItem key={childIndex} disablePadding>
                          <ListItemButton
                            onClick={() => handleNavigation(child.path)}
                            sx={{
                              pl: 4,
                              bgcolor: isActive ? 'primary.main' : 'transparent',
                              color: isActive ? 'white' : 'inherit',
                              '&:hover': {
                                bgcolor: isActive ? 'primary.dark' : 'action.hover'
                              }
                            }}
                          >
                            <ListItemText primary={child.text} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#1976d2'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          <IconButton color="inherit">
            <Fullscreen />
          </IconButton>
          <IconButton 
            color="inherit" 
            onClick={handleProfileMenuOpen}
            aria-controls={profileAnchorEl ? 'profile-menu' : undefined}
            aria-haspopup="true"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
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
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
