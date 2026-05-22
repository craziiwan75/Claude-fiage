"""Device model — many-to-one to Category."""
from datetime import datetime
from ..extensions import db


class Device(db.Model):
    __tablename__ = 'devices'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100))
    status = db.Column(db.String(20), nullable=False, default='在用')
    assignee = db.Column(db.String(50))
    category_id = db.Column(
        db.Integer,
        db.ForeignKey('categories.id', ondelete='RESTRICT'),
        nullable=False, index=True,
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    category = db.relationship('Category', back_populates='devices')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'model': self.model,
            'status': self.status,
            'assignee': self.assignee,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
        }
