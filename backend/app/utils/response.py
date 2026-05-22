"""Uniform response wrapper { code, message, data }."""
from typing import Any
from flask import jsonify


def ok(data: Any = None, message: str = '成功', code: int = 200):
    body = jsonify({'code': code, 'message': message, 'data': data})
    body.status_code = 200  # we always return HTTP 200; status lives in body.code
    return body


def fail(code: int, message: str, data: Any = None, http_status: int = None):
    body = jsonify({'code': code, 'message': message, 'data': data})
    body.status_code = http_status if http_status is not None else (code if 400 <= code < 600 else 500)
    return body
