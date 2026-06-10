import datetime

from app.models import Application, Award


def test_award_저장_및_조회(db_session):
    award = Award(
        title="대상",
        competition="경희대 SW 페스티벌",
        winners="홍길동, 김철수",
        awarded_on=datetime.date(2025, 11, 20),
        description="팀 프로젝트 수상",
    )
    db_session.add(award)
    db_session.commit()

    saved = db_session.query(Award).one()
    assert saved.title == "대상"
    assert saved.awarded_on.year == 2025


def test_application_저장시_제출시각_자동기록(db_session):
    application = Application(
        name="신입생",
        student_id="2026000000",
        phone="010-0000-0000",
        email="freshman@khu.ac.kr",
        motivation="개발을 배우고 싶습니다.",
    )
    db_session.add(application)
    db_session.commit()

    saved = db_session.query(Application).one()
    assert saved.created_at is not None
