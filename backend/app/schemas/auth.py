from marshmallow import Schema, fields, validate


class LoginRequestSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    password = fields.Str(required=True, validate=validate.Length(min=6, max=100))


class LoginResponseSchema(Schema):
    token = fields.Str(required=True)
    expires_in = fields.Int(required=True)
    user = fields.Dict(required=True)
