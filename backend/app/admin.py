from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

from app import config
from app.models import Activity, Application, Award, Post, User


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


class UserAdmin(ModelView, model=User):
    name = "회원"
    name_plural = "회원"
    can_create = False
    column_list = [
        User.id, User.username, User.name, User.student_id,
        User.role, User.is_approved, User.created_at,
    ]
    # 운영진이 승인 여부와 권한만 바꿀 수 있게 한다
    form_columns = [User.role, User.is_approved]
    column_searchable_list = [User.username, User.name]


class PostAdmin(ModelView, model=Post):
    name = "게시글"
    name_plural = "게시글"
    column_list = [Post.id, Post.board, Post.title, Post.author_id, Post.created_at]


class ActivityAdmin(ModelView, model=Activity):
    name = "활동"
    name_plural = "활동"
    column_list = [Activity.id, Activity.kind, Activity.title, Activity.semester]


def mount_admin(app, engine):
    admin = Admin(
        app,
        engine,
        authentication_backend=AdminAuth(secret_key=config.SECRET_KEY),
        title="RETURN 관리자",
    )
    admin.add_view(AwardAdmin)
    admin.add_view(ApplicationAdmin)
    admin.add_view(UserAdmin)
    admin.add_view(PostAdmin)
    admin.add_view(ActivityAdmin)
