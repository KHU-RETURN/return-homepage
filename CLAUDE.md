# RETURN 홈페이지

경희대학교 컴퓨터공학부 학술동아리 RETURN(1988년 창립)의 공식 홈페이지.

- 스택: React + Vite (JavaScript) + Tailwind / FastAPI + SQLAlchemy + SQLite / SQLAdmin
- 배포: Docker·Nginx 없이 uvicorn 단일 프로세스 + systemd (`deploy.sh`)
- 원칙: 신입생이 유지보수하며 배울 수 있도록, 개념이 눈에 보이는 단순한 구조 유지

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.
