# NewSive Frontend

> Next.js기반 실시간 뉴스 & 커뮤니티 플랫폼의 프론트엔드 프로젝트 입니다.

## Architecture Notes

- 페이지 단위 책임 분리 (app/)
- 공통 컴포넌트는 shared/ 하위에서 관리
- 초기에는 과도한 추상화를 지양
- 필요 시에만 store / api 모듈 분리
