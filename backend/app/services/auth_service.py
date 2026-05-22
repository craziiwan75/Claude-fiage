"""Login + JWT helpers."""
import os
from datetime import timedelta
from flask_jwt_extended import create_access_token

from ..models.user import User
from ..exceptions import BusinessError


def login(username: str, password: str) -> dict:
    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        raise BusinessError('用户名或密码错误', code=401, http_status=401)

    expires_hours = int(os.getenv('JWT_EXPIRES_HOURS', '2'))
    token = create_access_token(
        identity=str(user.id),
        additional_claims={'role': user.role, 'username': user.username},
        expires_delta=timedelta(hours=expires_hours),
    )
    return {
        'token': token,
        'expires_in': expires_hours * 3600,
        'user': {'id': user.id, 'username': user.username, 'role': user.role},
    }
