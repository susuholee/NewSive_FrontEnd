# NewSive Frontend

> Next.js 기반 실시간 뉴스 & 커뮤니티 플랫폼 **NewSive**의 프론트엔드 프로젝트입니다.

NewSive는 실시간으로 발생하는 뉴스와 알림을 빠르게 확인하고,  
커뮤니티 기능을 통해 사용자 간 소통을 제공하는 실시간 정보 기반 플랫폼을 목표로 합니다.

본 레포지토리는 NewSive 서비스의 **프론트엔드 UI 및 화면 구조**를 담당하며,  
페이지 단위 UI를 우선 구성한 뒤 백엔드 API와 단계적으로 연동하는 방식으로 개발 중입니다.

---

## 기술 스택

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Server State**: TanStack React Query
- **State Management**: Zustand
- **HTTP Client**: Axios

---

## 개발 현황

- [x] 개발 환경 안정화 (Windows + Turbopack 이슈 해결)
- [x] 페이지 단위 UI 구조 설계 및 구현
- [x] 상단 네비게이션 UI 구성
- [x] 목업 데이터를 활용한 화면 흐름 구성
---

## 구현된 기능

### 뉴스
- 뉴스 리스트 페이지 UI
- 뉴스 클릭 시 원문 링크 이동
- 외부 뉴스 API 연동을 고려한 구조 분리 (`service / external`)

### 인증
- 로그인 페이지 UI
- 회원가입 페이지 UI

### 알림
- 알림 센터 페이지 UI
- 알림 설정 페이지 UI

### 커뮤니티
- 실시간 채팅 페이지 UI (목업 데이터 기반)

### 사용자
- 마이페이지 UI (허브 역할)
- 계정 정보 수정 페이지 UI
- 친구 관리 페이지 UI

### 공통
- 상단 네비게이션 UI
- 사이드바 UI (구조 검토중)
- 전역 날씨 위젯 UI

---

### Architecture Notes
- 페이지 단위 UI를 먼저 구성한 뒤 API를 연동하는 방식을 사용
- 외부 API 접근 로직과 화면 로직을 분리하여 유지보수성을 고려
- 공통 컴포넌트는 `shared/components` 하위에서 관리

---

## 개발 방향

- UI 및 사용자 흐름을 우선적으로 설계
- 이후 Nest.js 기반 백엔드 API와 단계적으로 연동
- 실시간 기능(알림, 채팅)은 WebSocket 기반으로 확장 예정

---

## 향후 계획

- 뉴스 / 알림 API 연동
- 로그인 및 인증(JWT) 기능 연동
- 실시간 알림 및 채팅 기능 구현
- UI 공통 컴포넌트 정리 및 디자인 개선
- 서비스 배포 및 운영 환경 구성


