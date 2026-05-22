"""Global error handlers — every exception becomes a { code, message, data } JSON."""
import logging
from werkzeug.exceptions import HTTPException
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from flask_jwt_extended.exceptions import NoAuthorizationError, JWTExtendedException
from jwt import ExpiredSignatureError, InvalidTokenError

from ..utils.response import fail
from . import BusinessError

log = logging.getLogger('app.errors')


def register_error_handlers(app):

    @app.errorhandler(ValidationError)
    def _on_validation(err):
        # err.messages is a dict; flatten for friendly display
        first = _first_error(err.messages)
        return fail(400, f'参数校验失败：{first}', data=err.messages, http_status=400)

    @app.errorhandler(BusinessError)
    def _on_business(err):
        return fail(err.code, err.message, http_status=err.http_status)

    @app.errorhandler(NoAuthorizationError)
    @app.errorhandler(JWTExtendedException)
    @app.errorhandler(ExpiredSignatureError)
    @app.errorhandler(InvalidTokenError)
    def _on_jwt(err):
        msg = '登录已过期，请重新登录' if isinstance(err, ExpiredSignatureError) else '未授权访问，请先登录'
        return fail(401, msg, http_status=401)

    @app.errorhandler(IntegrityError)
    def _on_integrity(err):
        log.warning('integrity error: %s', err)
        return fail(409, '数据冲突：可能存在重复或外键约束限制', http_status=409)

    @app.errorhandler(SQLAlchemyError)
    def _on_db(err):
        log.exception('db error')
        return fail(500, '数据库异常，请稍后重试', http_status=500)

    @app.errorhandler(404)
    def _on_404(err):
        return fail(404, '接口不存在', http_status=404)

    @app.errorhandler(405)
    def _on_405(err):
        return fail(405, '请求方法不允许', http_status=405)

    @app.errorhandler(HTTPException)
    def _on_http(err):
        return fail(err.code or 500, err.description or 'HTTP error', http_status=err.code or 500)

    @app.errorhandler(Exception)
    def _on_any(err):
        log.exception('unhandled error')
        return fail(500, '系统异常，请稍后重试', http_status=500)


def _first_error(messages):
    """Pull the first human-friendly error string from a marshmallow errors dict."""
    if isinstance(messages, dict):
        for k, v in messages.items():
            sub = _first_error(v)
            if sub:
                return f'{k}: {sub}' if not k.isdigit() else sub
    elif isinstance(messages, list) and messages:
        return _first_error(messages[0])
    elif isinstance(messages, str):
        return messages
    return ''
