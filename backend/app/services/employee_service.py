"""Employee CRUD service."""
from sqlalchemy.exc import IntegrityError

from ..extensions import db
from ..models.employee import Employee
from ..exceptions import BusinessError, NotFoundError


def list_employees(page: int = 1, page_size: int = 20):
    q = Employee.query.order_by(Employee.created_at.desc())
    total = q.count()
    items = q.limit(page_size).offset((page - 1) * page_size).all()
    return {
        'items': [e.to_dict() for e in items],
        'total': total,
        'page': page,
        'page_size': page_size,
    }


def get_employee(emp_id: int) -> dict:
    emp = Employee.query.get(emp_id)
    if not emp:
        raise NotFoundError('员工')
    return emp.to_dict()


def create_employee(payload: dict) -> dict:
    emp = Employee(**payload)
    try:
        db.session.add(emp)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise BusinessError('邮箱已存在', code=409, http_status=409)
    return emp.to_dict()


def update_employee(emp_id: int, payload: dict) -> dict:
    emp = Employee.query.get(emp_id)
    if not emp:
        raise NotFoundError('员工')
    for k, v in payload.items():
        setattr(emp, k, v)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise BusinessError('邮箱已存在', code=409, http_status=409)
    return emp.to_dict()


def delete_employee(emp_id: int) -> None:
    emp = Employee.query.get(emp_id)
    if not emp:
        raise NotFoundError('员工')
    db.session.delete(emp)
    db.session.commit()
