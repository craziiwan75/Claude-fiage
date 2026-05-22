"""
Global API access logger.

Records:    YYYY-MM-DD HH:MM:SS [METHOD] /path  ip=<real>  status=<code>  cost=<ms>ms

Wires:
  - before_request: stamps a start time on flask.g
  - after_request:  emits the log line + adds X-Response-Time header
  - teardown_request: catches the case where an exception killed after_request
"""
import logging
import os
import time
from logging.handlers import RotatingFileHandler

from flask import g, request


_FMT = '%(asctime)s %(levelname)-5s %(name)s | %(message)s'


def init_logger(app):
    level = getattr(logging, app.config.get('LOG_LEVEL', 'INFO').upper(), logging.INFO)
    log_dir = app.config.get('LOG_DIR', './logs')
    os.makedirs(log_dir, exist_ok=True)

    formatter = logging.Formatter(_FMT, datefmt='%Y-%m-%d %H:%M:%S')

    # root app logger
    root = logging.getLogger()
    root.setLevel(level)
    # console
    if not any(isinstance(h, logging.StreamHandler) for h in root.handlers):
        sh = logging.StreamHandler()
        sh.setFormatter(formatter)
        root.addHandler(sh)
    # rotating file (5MB × 5)
    fh = RotatingFileHandler(
        os.path.join(log_dir, 'app.log'),
        maxBytes=5 * 1024 * 1024, backupCount=5, encoding='utf-8',
    )
    fh.setFormatter(formatter)
    root.addHandler(fh)


class LoggingMiddleware:
    """Light-touch — only records timing + outcome. Doesn't read body."""

    def __init__(self, app):
        self.log = logging.getLogger('app.access')
        app.before_request(self._before)
        app.after_request(self._after)

    def _client_ip(self):
        # Honor X-Forwarded-For when behind a proxy
        fwd = request.headers.get('X-Forwarded-For', '')
        if fwd:
            return fwd.split(',')[0].strip()
        return request.headers.get('X-Real-IP') or request.remote_addr or '-'

    def _before(self):
        g._start_time = time.perf_counter()

    def _after(self, resp):
        start = getattr(g, '_start_time', None)
        cost_ms = round((time.perf_counter() - start) * 1000, 1) if start else 0
        try:
            self.log.info(
                '[%s] %s  ip=%s  status=%s  cost=%sms',
                request.method, request.full_path.rstrip('?'),
                self._client_ip(), resp.status_code, cost_ms,
            )
        except Exception:
            pass
        resp.headers['X-Response-Time'] = f'{cost_ms}ms'
        return resp
