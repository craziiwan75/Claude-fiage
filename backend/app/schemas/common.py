"""Common schemas — uniform response wrapper + pagination args."""
from marshmallow import Schema, fields


class ApiResponseSchema(Schema):
    code = fields.Int(required=True, metadata={'description': '200=成功；非200=失败'})
    message = fields.Str(required=True)
    data = fields.Raw(allow_none=True)


class PaginationArgsSchema(Schema):
    page = fields.Int(load_default=1)
    page_size = fields.Int(load_default=20)
