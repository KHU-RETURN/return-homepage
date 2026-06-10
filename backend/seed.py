"""개발용 샘플 데이터. 사용법: .venv/bin/python seed.py"""
import datetime

from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app.models import Activity, Award, Post, User


if __name__ == "__main__":
    Base.metadata.create_all(engine)
    db = SessionLocal()

    if db.query(Award).count() == 0:
        db.add_all([
            Award(title="대상", competition="경희대 SW 페스티벌",
                  winners="홍길동, 김철수", awarded_on=datetime.date(2025, 11, 20),
                  description="동아리 팀 프로젝트로 출전해 대상 수상"),
            Award(title="우수상", competition="khuthon",
                  winners="이영희 외 3명", awarded_on=datetime.date(2025, 5, 10),
                  description="교내 해커톤 우수상"),
            Award(title="장려상", competition="전국 대학생 프로그래밍 경진대회",
                  winners="박민수", awarded_on=datetime.date(2024, 9, 1),
                  description=""),
        ])
        db.commit()
        print("샘플 수상 3건 입력 완료")
    else:
        print("수상: 이미 데이터가 있어 건너뜀")

    # 운영진 계정 (비밀번호는 첫 로그인 후 반드시 변경할 것)
    if db.query(User).count() == 0:
        admin = User(
            username="admin",
            password_hash=hash_password("changeme"),
            name="운영진",
            student_id="0000000000",
            role="admin",
            is_approved=True,
        )
        db.add(admin)
        db.commit()
        print("admin 계정 생성 완료 (비밀번호: changeme)")
    else:
        print("회원: 이미 데이터가 있어 건너뜀")

    if db.query(Activity).count() == 0:
        db.add_all([
            Activity(kind="study", title="알고리즘 스터디", semester="2026-1",
                     description="매주 백준 문제를 풀고 풀이를 공유합니다. 코딩테스트 대비에 좋습니다."),
            Activity(kind="study", title="웹 풀스택 스터디", semester="2026-1",
                     description="React와 FastAPI로 작은 서비스를 직접 만들어 봅니다."),
            Activity(kind="study", title="CS 면접 스터디", semester="2026-1",
                     description="운영체제, 네트워크, 데이터베이스 등 전공 지식을 면접 형식으로 점검합니다."),
            Activity(kind="group", title="CTF 소모임", semester="2026-1",
                     description="보안 CTF 대회 문제를 함께 풀며 해킹과 보안 기초를 다집니다."),
            Activity(kind="group", title="게임잼 소모임", semester="2026-1",
                     description="짧은 기간에 게임을 완성하는 게임잼에 팀으로 참가합니다."),
            Activity(kind="mt", title="봄 MT", semester="2026-1",
                     description="새 학기 신입 부원 환영을 겸한 1박 2일 MT입니다."),
        ])
        db.commit()
        print("샘플 활동 6건 입력 완료")
    else:
        print("활동: 이미 데이터가 있어 건너뜀")

    if db.query(Post).count() == 0:
        admin = db.query(User).filter(User.username == "admin").first()
        if admin is not None:
            db.add_all([
                Post(board="notice", title="2026-1 RETURN 정기 모집 안내",
                     content=(
                         "2026학년도 1학기 RETURN 신입 부원을 모집합니다. "
                         "컴퓨터공학에 관심 있는 경희대 학생이라면 누구나 지원할 수 있습니다. "
                         "홈페이지 지원하기 메뉴에서 지원서를 제출해 주세요. "
                         "모집 마감은 3월 둘째 주 금요일입니다."
                     ),
                     author_id=admin.id),
                Post(board="notice", title="동아리방 이용 안내",
                     content=(
                         "동아리방은 전자정보대학관에 있으며 부원이라면 자유롭게 이용할 수 있습니다. "
                         "마지막에 나가는 사람은 에어컨과 소등을 꼭 확인해 주세요. "
                         "비품을 사용한 뒤에는 제자리에 정리해 주시기 바랍니다."
                     ),
                     author_id=admin.id),
            ])
            db.commit()
            print("샘플 공지 2건 입력 완료")
    else:
        print("게시글: 이미 데이터가 있어 건너뜀")

    db.close()
