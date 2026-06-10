"""개발용 샘플 데이터. 사용법: .venv/bin/python seed.py"""
import datetime

from app.database import Base, SessionLocal, engine
from app.models import Award


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
        print("이미 데이터가 있어 건너뜀")
    db.close()
