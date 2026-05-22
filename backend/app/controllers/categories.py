"""Category CRUD (+ nested devices listing)."""
from flask.views import MethodView
from flask_smorest import Blueprint
from flask_jwt_extended import jwt_required

from ..schemas.category import CategoryCreateSchema, CategoryUpdateSchema
from ..services import category_service, device_service
from ..utils.response import ok


blp = Blueprint(
    'categories', 'categories', url_prefix='/api/categories',
    description='设备分类',
)


@blp.route('')
class CategoryListView(MethodView):
    @jwt_required()
    def get(self):
        """分类列表（含 device_count）"""
        return ok(category_service.list_categories())

    @jwt_required()
    @blp.arguments(CategoryCreateSchema)
    def post(self, payload):
        """新增分类"""
        return ok(category_service.create_category(payload), message='创建成功')


@blp.route('/<int:cat_id>')
class CategoryItemView(MethodView):
    @jwt_required()
    @blp.arguments(CategoryUpdateSchema)
    def put(self, payload, cat_id):
        """修改分类"""
        return ok(category_service.update_category(cat_id, payload), message='修改成功')

    @jwt_required()
    def delete(self, cat_id):
        """删除分类（有设备时拒绝）"""
        category_service.delete_category(cat_id)
        return ok(message='删除成功')


@blp.route('/<int:cat_id>/devices')
class CategoryDevicesView(MethodView):
    @jwt_required()
    def get(self, cat_id):
        """查询某分类下的所有设备（联表查询）"""
        return ok(device_service.list_devices(category_id=cat_id))
