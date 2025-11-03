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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Save as SaveIcon,
  FileDownload as ExcelIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  FolderOpen as FolderIcon
} from '@mui/icons-material';

// Mock 데이터
const mockItems = [
  {
    id: 1,
    code: 'CBP01',
    name: '브라켓트레이보호필름',
    specification: '',
    unit: '',
    category: '부재료',
    status: 'Y'
  },
  {
    id: 2,
    code: 'CBP02',
    name: '브라켓트레이보호필름2',
    specification: '100x200mm',
    unit: 'EA',
    category: '부재료',
    status: 'Y'
  },
  {
    id: 3,
    code: 'CBP03',
    name: '브라켓트레이보호필름3',
    specification: '150x250mm',
    unit: 'EA',
    category: '부재료',
    status: 'Y'
  }
];

function ItemManagement() {
  const [items, setItems] = useState(mockItems);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [showDetail, setShowDetail] = useState(false);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    specification: '',
    category: '',
    status: 'Y',
    remarks: '',
    image: ''
  });

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      specification: item.specification || '',
      category: item.category,
      status: item.status,
      remarks: '',
      image: ''
    });
    setShowDetail(true);
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = () => {
    if (selectedItem) {
      // 수정
      setItems(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      // 신규
      const newItem = {
        id: items.length + 1,
        ...formData
      };
      setItems(prev => [...prev, newItem]);
    }
    setShowDetail(false);
    setSelectedItem(null);
    setFormData({
      code: '',
      name: '',
      specification: '',
      category: '',
      status: 'Y',
      remarks: '',
      image: ''
    });
  };

  const handleNew = () => {
    setSelectedItem(null);
    setFormData({
      code: '',
      name: '',
      specification: '',
      category: '',
      status: 'Y',
      remarks: '',
      image: ''
    });
    setShowDetail(true);
  };

  const filteredItems = items.filter(item => {
    const matchesCode = item.code.toLowerCase().includes(searchCode.toLowerCase());
    const matchesName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCategory = categoryFilter === '전체' || item.category === categoryFilter;
    const matchesStatus = statusFilter === '전체' || item.status === statusFilter;
    
    return matchesCode && matchesName && matchesCategory && matchesStatus;
  });

  return (
    <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 120px)' }}>
      {/* 왼쪽 테이블 영역 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">품목 관리</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<SearchIcon />}>검색</Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleNew}>신규</Button>
              <Button variant="outlined" startIcon={<SaveIcon />}>저장</Button>
              <Button variant="outlined" startIcon={<ExcelIcon />}>엑셀다운로드</Button>
              <Button variant="outlined" startIcon={<RefreshIcon />}>새로고침</Button>
            </Box>
          </Box>

          {/* 검색 필터 */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                label="품목코드"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                label="품목명"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth size="small">
                <InputLabel>구분</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="전체">전체</MenuItem>
                  <MenuItem value="부재료">부재료</MenuItem>
                  <MenuItem value="원자재">원자재</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth size="small">
                <InputLabel>사용여부</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="전체">전체</MenuItem>
                  <MenuItem value="Y">Y</MenuItem>
                  <MenuItem value="N">N</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* 테이블 */}
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">#</TableCell>
                  <TableCell>품목코드</TableCell>
                  <TableCell>품목명</TableCell>
                  <TableCell>규격</TableCell>
                  <TableCell>단위</TableCell>
                  <TableCell>구분</TableCell>
                  <TableCell>사용여부</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow
                    key={item.id}
                    hover
                    selected={selectedItem?.id === item.id}
                    onClick={() => handleItemSelect(item)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedItem?.id === item.id ? 'primary.light' : 'inherit',
                      '&:hover': {
                        bgcolor: selectedItem?.id === item.id ? 'primary.light' : 'action.hover'
                      }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItem?.id === item.id}
                        onChange={() => handleItemSelect(item)}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.specification}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="caption" sx={{ mt: 1 }}>
            Record ID: {selectedItem?.id || 1}
          </Typography>
        </Paper>
      </Box>

      {/* 오른쪽 상세 정보 영역 */}
      {showDetail && (
        <Box sx={{ width: 400 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">품목 관리 상세정보</Typography>
                <IconButton onClick={() => setShowDetail(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="품목코드"
                    value={formData.code}
                    onChange={handleInputChange('code')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="품목명"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="규격"
                    placeholder="규격"
                    value={formData.specification}
                    onChange={handleInputChange('specification')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>구분</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={handleInputChange('category')}
                    >
                      <MenuItem value="부재료">부재료</MenuItem>
                      <MenuItem value="원자재">원자재</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>사용여부</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={handleInputChange('status')}
                    >
                      <MenuItem value="Y">Y</MenuItem>
                      <MenuItem value="N">N</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="비고"
                    placeholder="비고"
                    value={formData.remarks}
                    onChange={handleInputChange('remarks')}
                    size="small"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="품목이미지"
                    placeholder="이미지파일"
                    value={formData.image}
                    onChange={handleInputChange('image')}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <FolderIcon />
                        </IconButton>
                      )
                    }}
                  />
                </Grid>
              </Grid>
              
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
    </Box>
  );
}

export default ItemManagement;
