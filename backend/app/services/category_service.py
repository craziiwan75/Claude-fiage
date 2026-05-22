"""Category CRUD service."""
from sqlalchemy.exc import IntegrityError

from ..extensions import db
from ..models.category import Category
from ..exceptions import BusinessError, NotFoundError


def list_categories():
    cats = Category.query.order_by(Category.id.asc()).all()
    return [c.to_dict(with_count=True) for c in cats]


def create_category(payload: dict) -> dict:
    cat = Category(**payload)
    try:
        db.session.add(cat)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise BusinessError('分类名称已存在', code=409, http_status=409)
    return cat.to_dict()


def update_category(cat_id: int, payload: dict) -> dict:
    cat = Category.query.get(cat_id)
    if not cat:
        raise NotFoundError('分类')
    for k, v in payload.items():
        setattr(cat, k, v)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise BusinessError('分类名称已存在', code=409, http_status=409)
    return cat.to_dict()


def delete_category(cat_id: int) -> None:
    cat = Category.query.get(cat_id)
    if not cat:
        raise NotFoundError('分类')
    if len(cat.devices) > 0:
        raise BusinessError(
            f'分类下存在 {len(cat.devices)} 台设备，无法删除',
            code=409, http_status=409,
        )
    db.session.delete(cat)
    db.session.commit()
