"""Device CRUD — supports ?category_id= filter."""
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint
from flask_jwt_extended import jwt_required

from ..schemas.device import DeviceCreateSchema, DeviceUpdateSchema
from ..services import device_service
from ..utils.response import ok


blp = Blueprint(
    'devices', 'devices', url_prefix='/api/devices',
    description='设备管理',
)


@blp.route('')
class DeviceListView(MethodView):
    @jwt_required()
    def get(self):
        """设备列表（可按 ?category_id= 过滤）"""
        cat = request.args.get('category_id', type=int)
        return ok(device_service.list_devices(cat))

    @jwt_required()
    @blp.arguments(DeviceCreateSchema)
    def post(self, payload):
        """新增设备"""
        return ok(device_service.create_device(payload), message='创建成功')


@blp.route('/<int:dev_id>')
class DeviceItemView(MethodView):
    @jwt_required()
    def get(self, dev_id):
        """查询设备详情"""
        return ok(device_service.get_device(dev_id))

    @jwt_required()
    @blp.arguments(DeviceUpdateSchema)
    def put(self, payload, dev_id):
        """修改设备"""
        return ok(device_service.update_device(dev_id, payload), message='修改成功')

    @jwt_required()
    def delete(self, dev_id):
        """删除设备"""
        device_service.delete_device(dev_id)
        return ok(message='删除成功')
