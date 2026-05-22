class BusinessError(Exception):
    """Raise for known, user-facing business errors."""
    def __init__(self, message: str, code: int = 409, http_status: int = 409):
        super().__init__(message)
        self.message = message
        self.code = code
        self.http_status = http_status


class NotFoundError(BusinessError):
    def __init__(self, resource: str = '资源'):
        super().__init__(f'{resource}不存在', code=404, http_status=404)
