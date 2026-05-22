"""
Application factory. Wires up extensions, blueprints, middlewares and
the global error handler.
"""
import os
from flask import Flask
from flask_cors import CORS
from flask_smorest import Api

from .config import Config
from .extensions import db, migrate, jwt
from .middlewares.logging import LoggingMiddleware, init_logger
from .exceptions.handlers import register_error_handlers
from .controllers.auth import blp as auth_blp
from .controllers.employees import blp as employees_blp
from .controllers.categories import blp as categories_blp
from .controllers.devices import blp as devices_blp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # ── extensions ────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    # OpenAPI via Flask-Smorest
    app.config['API_TITLE'] = '工蜂办公 API'
    app.config['API_VERSION'] = 'v1'
    app.config['OPENAPI_VERSION'] = '3.0.3'
    app.config['OPENAPI_URL_PREFIX'] = '/'
    app.config['OPENAPI_SWAGGER_UI_PATH'] = '/swagger'
    app.config['OPENAPI_SWAGGER_UI_URL'] = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/'

    api = Api(app)

    # ── logging middleware ────────────────────────────
    init_logger(app)
    LoggingMiddleware(app)

    # ── error handlers ────────────────────────────────
    register_error_handlers(app)

    # ── routes ────────────────────────────────────────
    api.register_blueprint(auth_blp)
    api.register_blueprint(employees_blp)
    api.register_blueprint(categories_blp)
    api.register_blueprint(devices_blp)

    @app.get('/health')
    def health():
        return {'status': 'ok', 'service': 'gongfeng-backend'}

    return app
