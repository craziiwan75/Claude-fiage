"""Employee CRUD (protected by JWT)."""
from flask.views import MethodView
from flask_smorest import Blueprint
from flask_jwt_extended import jwt_required

from ..schemas.employee import EmployeeCreateSchema, EmployeeUpdateSchema
from ..schemas.common import PaginationArgsSchema
from ..services import employee_service
from ..utils.response import ok


blp = Blueprint(
    'employees', 'employees', url_prefix='/api/employees',
    description='员工管理（仅管理员）',
)


@blp.route('')
class EmployeeListView(MethodView):
    @jwt_required()
    @blp.arguments(PaginationArgsSchema, location='query')
    def get(self, args):
        """员工列表（分页，按创建时间倒序）"""
        return ok(employee_service.list_employees(args['page'], args['page_size']))

    @jwt_required()
    @blp.arguments(EmployeeCreateSchema)
    def post(self, payload):
        """新增员工"""
        return ok(employee_service.create_employee(payload), message='创建成功')


@blp.route('/<int:emp_id>')
class EmployeeItemView(MethodView):
    @jwt_required()
    def get(self, emp_id):
        """根据 ID 查询员工"""
        return ok(employee_service.get_employee(emp_id))

    @jwt_required()
    @blp.arguments(EmployeeUpdateSchema)
    def put(self, payload, emp_id):
        """修改员工信息"""
        return ok(employee_service.update_employee(emp_id, payload), message='修改成功')

    @jwt_required()
    def delete(self, emp_id):
        """删除员工"""
        employee_service.delete_employee(emp_id)
        return ok(message='删除成功')
