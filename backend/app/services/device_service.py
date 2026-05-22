"""Device CRUD service."""
from ..extensions import db
from ..models.device import Device
from ..models.category import Category
from ..exceptions import BusinessError, NotFoundError


def list_devices(category_id: int = None):
    q = Device.query
    if category_id is not None:
        # validate that the category exists for cleaner 404s
        if not Category.query.get(category_id):
            raise NotFoundError('分类')
        q = q.filter(Device.category_id == category_id)
    items = q.order_by(Device.id.desc()).all()
    return [d.to_dict() for d in items]


def get_device(dev_id: int) -> dict:
    d = Device.query.get(dev_id)
    if not d:
        raise NotFoundError('设备')
    return d.to_dict()


def _assert_category(cat_id: int):
    if not Category.query.get(cat_id):
        raise BusinessError('所选分类不存在', code=400, http_status=400)


def create_device(payload: dict) -> dict:
    _assert_category(payload['category_id'])
    d = Device(**payload)
    db.session.add(d)
    db.session.commit()
    return d.to_dict()


def update_device(dev_id: int, payload: dict) -> dict:
    d = Device.query.get(dev_id)
    if not d:
        raise NotFoundError('设备')
    if 'category_id' in payload:
        _assert_category(payload['category_id'])
    for k, v in payload.items():
        setattr(d, k, v)
    db.session.commit()
    return d.to_dict()


def delete_device(dev_id: int) -> None:
    d = Device.query.get(dev_id)
    if not d:
        raise NotFoundError('设备')
    db.session.delete(d)
    db.session.commit()
