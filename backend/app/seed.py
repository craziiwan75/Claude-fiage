"""
Standalone seeder: creates the admin user with a fresh bcrypt hash so the
init.sql hash doesn't have to be trusted.

Usage:  python -m app.seed
"""
from app import create_app
from app.extensions import db
from app.models.user import User


def run():
    app = create_app()
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            u = User(username='admin', role='admin')
            u.set_password('admin123')
            db.session.add(u)
            db.session.commit()
            print('Seeded admin / admin123')
        else:
            print('admin already exists, skipping')


if __name__ == '__main__':
    run()
