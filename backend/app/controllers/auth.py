"""Auth controller — login (public)."""
from flask.views import MethodView
from flask_smorest import Blueprint

from ..schemas.auth import LoginRequestSchema
from ..services import auth_service
from ..utils.response import ok


blp = Blueprint(
    'auth', 'auth', url_prefix='/api/auth',
    description='登录认证',
)


@blp.route('/login')
class LoginView(MethodView):
    @blp.arguments(LoginRequestSchema)
    def post(self, payload):
        """管理员登录 - 颁发 JWT"""
        data = auth_service.login(payload['username'], payload['password'])
        return ok(data, message='登录成功')
