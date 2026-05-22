"""Device category model — 1:N with Device."""
from datetime import datetime
from ..extensions import db


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    devices = db.relationship(
        'Device', back_populates='category',
        cascade='all, delete-orphan', passive_deletes=False,
    )

    def to_dict(self, with_count: bool = True):
        d = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
        }
        if with_count:
            d['device_count'] = len(self.devices)
        return d
