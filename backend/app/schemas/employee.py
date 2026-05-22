from marshmallow import Schema, fields, validate, EXCLUDE


class _Base(Schema):
    class Meta:
        unknown = EXCLUDE


class EmployeeSchema(_Base):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=20))
    age = fields.Int(required=True, validate=validate.Range(min=18, max=60))
    email = fields.Email(required=True, error_messages={'invalid': '邮箱格式错误'})
    dept = fields.Str(validate=validate.Length(max=50), load_default=None)
    title = fields.Str(validate=validate.Length(max=50), load_default=None)
    created_at = fields.Str(dump_only=True)


class EmployeeCreateSchema(EmployeeSchema):
    pass


class EmployeeUpdateSchema(_Base):
    name = fields.Str(validate=validate.Length(min=1, max=20))
    age = fields.Int(validate=validate.Range(min=18, max=60))
    email = fields.Email(error_messages={'invalid': '邮箱格式错误'})
    dept = fields.Str(validate=validate.Length(max=50))
    title = fields.Str(validate=validate.Length(max=50))
