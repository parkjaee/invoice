# CAPS (Cargo Acceptance System) 모듈

화물 수용 시스템 관련 React 컴포넌트 및 로직

## 구조

```
caps/
├── components/    # CAPS 전용 UI 컴포넌트
├── services/      # CAPS API 호출 서비스
├── pages/         # CAPS 화면 (페이지)
└── hooks/         # CAPS 커스텀 React Hooks
```

## 예시

### components/
- UserList.jsx
- UserForm.jsx
- CargoGrid.jsx

### services/
- userService.js
- cargoService.js

### pages/
- UserManagement.jsx
- CargoDashboard.jsx

### hooks/
- useUsers.js
- useCargo.js
