# Design System — RETURN 홈페이지

## Product Context
- **What this is:** 경희대학교 컴퓨터공학부 학술동아리 RETURN(1988년 창립)의 공식 홈페이지. 동아리 소개, 수상/활동, 모집·지원, 회원 게시판(질문/자료/공지)을 제공한다.
- **Who it's for:** 입부를 고민하는 경희대 컴공 신입생(1차), 활동 중인 동아리원(2차)
- **Space/industry:** 대학 학술동아리 / 개발자 커뮤니티
- **Project type:** 소개(마케팅) + 커뮤니티 게시판 하이브리드 웹사이트

## Aesthetic Direction
- **Direction:** 모노크롬 브루탈리스트 (Bold Editorial — 흑/백 유지, 강도만 끌어올림)
- **Decoration level:** bold — 색은 여전히 흑백뿐이지만, 스케일·반전·반복으로 시각적 충격을 만든다.
- **Mood:** 절제되고 지적인 개발자 감성. 1988년부터 이어진 학술동아리의 무게감. 화려함 대신 명료함과 대담함.
- **Graphic motif:** 흑백 루프 로고(`frontend/public/return-logo.png`). 히어로/섹션 배경에 거대한 워터마크로 사용.
- **Bold 장치 (허용 목록):**
  - **다크 히어로:** 홈 첫 화면은 잉크(#0A0A0A) 풀블리드 배경 + 페이퍼 텍스트로 반전. 뷰포트 높이의 대부분을 차지.
  - **거대 워드마크:** "RETURN"을 `clamp(4rem, 14vw, 12rem)` 수준으로. 화면을 지배하는 타이포가 곧 그래픽.
  - **마퀴 스트립:** `RETURN · SINCE 1988 · KHU CSE ·` 반복 텍스트가 흐르는 띠. 섹션 경계 장식. CSS keyframes만 사용(라이브러리 금지), `prefers-reduced-motion` 존중.
  - **넘버드 섹션:** 섹션·카드에 `01 / 02 / 03` 모노 폰트 인덱스. 그리드 셀은 `border: 1px solid` 공유 보더로 표처럼 짠다.
  - **반전 섹션:** 페이지당 1~2개 섹션은 흑백 반전(잉크 배경)으로 리듬을 만든다. 푸터는 항상 잉크 배경.
  - **아웃라인 텍스트:** 장식용 초대형 텍스트는 `-webkit-text-stroke: 1px` 아웃라인 처리 가능.

## Typography
- **Display/Hero:** Space Grotesk — "RETURN" 워드마크와 라틴 헤드라인용. 기하학적 그로테스크가 루프 로고의 둥근 기하와 호응한다.
- **Body (한글):** Pretendard — 한글 웹폰트의 사실상 표준. 가독성 검증 완료, 신입생에게도 익숙해 유지보수 친화적.
- **UI/Labels:** Pretendard (본문과 동일)
- **Data/Metadata:** JetBrains Mono — 날짜, 학번, 게시글 번호, 태그 등 모든 메타데이터. tabular-nums 지원. 터미널 감성을 은은하게 깔아주는 RETURN만의 시그니처.
- **Code:** JetBrains Mono
- **Loading:**
  - Pretendard: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css`
  - Space Grotesk, JetBrains Mono: Google Fonts `<link>` (필요 웨이트만: 500/700)
- **Scale (모듈러, 1.25배):**
  - hero: 56px / 3.5rem (bold, Space Grotesk)
  - h1: 40px / 2.5rem
  - h2: 32px / 2rem
  - h3: 24px / 1.5rem
  - body: 16px / 1rem (line-height 1.7 — 한글 기준)
  - small/meta: 13px / 0.8125rem (JetBrains Mono)

## Color
- **Approach:** restrained — 장식용 컬러 0개. 색은 의미가 있을 때만 쓴다.
- **Ink (텍스트/버튼):** `#0A0A0A`
- **Paper (배경):** `#FAFAFA`
- **Neutrals (그레이 스케일):**
  - gray-100 `#F0F0F0` (서피스, 카드 배경)
  - gray-300 `#D4D4D4` (보더)
  - gray-500 `#8A8A8A` (보조 텍스트)
  - gray-700 `#4A4A4A` (서브 헤딩)
- **Semantic (폼 검증 등 기능적 용도 전용):** success `#16A34A`, warning `#D97706`, error `#DC2626`, info `#2563EB`
- **Interactive:** 버튼 = 솔리드 블랙(`#0A0A0A`) + 화이트 텍스트, hover 시 gray-700. 링크 = 블랙 + 언더라인, hover 시 언더라인 두껍게.
- **Dark mode:** 1차 범위 제외. 추가 시 Paper `#111111` / Ink `#F5F5F5`로 반전, 시맨틱 컬러는 채도 15% 감소.

## Spacing
- **Base unit:** 4px
- **Density:** comfortable — 소개 페이지는 여백을 아끼지 않는다. 게시판은 한 단계 촘촘하게(md 기준).
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64) 4xl(96)

## Layout
- **Approach:** hybrid — 소개/모집 페이지는 에디토리얼(큰 타이포, 비대칭, 과감한 여백), 게시판/마이페이지는 grid-disciplined(정직한 표, 명확한 정렬)
- **Grid:** 데스크톱 12컬럼 / 태블릿 8컬럼 / 모바일 4컬럼, 거터 24px
- **Max content width:** 1120px (본문 텍스트 컬럼은 720px)
- **Border radius:** 최소주의 — none(0) 기본, sm(4px) 입력 필드·버튼만. 둥근 카드 금지, 모노크롬엔 각진 형태가 어울린다.

## Motion
- **Approach:** minimal-functional — 이해를 돕는 전환만. 스크롤 트리거 애니메이션·패럴랙스 금지.
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(100ms — hover) short(200ms — 페이지 요소 등장, 드롭다운)
- **허용 목록:** 링크/버튼 hover 전환, 모달·드롭다운 페이드, 폼 에러 메시지 등장, 마퀴 스트립(CSS keyframes, 등속, `prefers-reduced-motion: reduce`면 정지), 터미널 캐럿 블링크(워드마크 끝 `_`, step-end 1.2s), 페이지 진입 시 1회 rise 등장(200ms ease-out, 60ms 간격 스태거). 그 외 전부 금지.
- **시그니처 디테일:** `::selection` 흑백 반전, 키보드 포커스는 2px 잉크 아웃라인(둥글기 없음), 모노 숫자는 tabular-nums.

## Anti-patterns (이 프로젝트에서 금지)
- 그라데이션 (버튼, 배경, 텍스트 전부)
- 장식용 컬러, 컬러 아이콘 원형 배지
- 3컬럼 아이콘 그리드 히어로
- 큰 border-radius의 둥근 카드
- 그림자 남용 (보더로 구분한다: `1px solid gray-300`)

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-10 | 모노크롬 미니멀로 초기 디자인 시스템 확정 | 사용자 확인: "리턴은 흑/백" — 로고가 모노크롬이며 흑백이 동아리 정체성. /design-consultation으로 작성 |
| 2026-06-10 | 악센트 컬러 제로, 시맨틱 컬러만 허용 | 흑백 위계만으로 차별화. 색이 등장하면 반드시 의미가 있다는 규칙이 신입생에게도 가르치기 쉬움 |
| 2026-06-10 | 메타데이터는 전부 JetBrains Mono | 터미널 감성의 시그니처. 컴공 학술동아리 정체성 표현 |
| 2026-06-10 | bold 브루탈리스트로 강도 상향 | 사용자 피드백 "디자인 너무 구려" — 흑백은 유지하되 다크 히어로·거대 타이포·마퀴·넘버드 그리드·반전 섹션으로 시각적 임팩트 확보 |
| 2026-06-10 | 활동(스터디·소모임·MT)은 DB 관리 | Activity 모델 + SQLAdmin으로 운영진이 코드 수정 없이 매 학기 갱신 |
