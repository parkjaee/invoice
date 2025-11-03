# Common (공통) 모듈

CAPS와 Invoice에서 공통으로 사용하는 컴포넌트 및 유틸리티

## 구조

```
common/
├── components/    # 공통 UI 컴포넌트 (재사용 가능)
├── services/      # 공통 API 서비스 (axios 설정 등)
└── utils/         # 유틸리티 함수
```

## 예시

### components/
- Layout.jsx
- Header.jsx
- Sidebar.jsx
- DataGrid.jsx
- DatePicker.jsx
- Button.jsx

### services/
- api.js (axios 기본 설정)
- authService.js (인증)

### utils/
- dateUtil.js
- stringUtil.js
- validationUtil.js
