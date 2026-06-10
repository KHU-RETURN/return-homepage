from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

from app import config
from app.models import Application, Award


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        if (
            form.get("username") == config.ADMIN_USERNAME
            and form.get("password") == config.ADMIN_PASSWORD
        ):
            request.session.update({"admin": True})
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return bool(request.session.get("admin"))


class AwardAdmin(ModelView, model=Award):
    name = "수상"
    name_plural = "수상 내역"
    column_list = [Award.id, Award.title, Award.competition, Award.winners, Award.awarded_on]
    column_searchable_list = [Award.title, Award.competition]


class ApplicationAdmin(ModelView, model=Application):
    name = "지원서"
    name_plural = "지원서"
    can_create = False
    can_edit = False
    can_delete = False
    column_list = [Application.id, Application.name, Application.student_id, Application.created_at]


def mount_admin(app, engine):
    admin = Admin(
        app,
        engine,
        authentication_backend=AdminAuth(secret_key=config.SECRET_KEY),
        title="RETURN 관리자",
    )
    admin.add_view(AwardAdmin)
    admin.add_view(ApplicationAdmin)
