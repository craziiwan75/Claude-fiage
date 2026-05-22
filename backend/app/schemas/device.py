from marshmallow import Schema, fields, validate, EXCLUDE


class DeviceSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    model = fields.Str(validate=validate.Length(max=100), load_default=None)
    status = fields.Str(
        validate=validate.OneOf(['在用', '闲置', '维修', '库存']),
        load_default='在用',
    )
    assignee = fields.Str(validate=validate.Length(max=50), load_default=None)
    category_id = fields.Int(required=True)
    category_name = fields.Str(dump_only=True)


class DeviceCreateSchema(DeviceSchema):
    pass


class DeviceUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(validate=validate.Length(min=1, max=100))
    model = fields.Str(validate=validate.Length(max=100))
    status = fields.Str(validate=validate.OneOf(['在用', '闲置', '维修', '库存']))
    assignee = fields.Str(validate=validate.Length(max=50))
    category_id = fields.Int()
