from marshmallow import Schema, fields, validate, EXCLUDE


class CategorySchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=20))
    description = fields.Str(validate=validate.Length(max=200), load_default=None)
    device_count = fields.Int(dump_only=True)


class CategoryCreateSchema(CategorySchema):
    pass


class CategoryUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(validate=validate.Length(min=1, max=20))
    description = fields.Str(validate=validate.Length(max=200))
