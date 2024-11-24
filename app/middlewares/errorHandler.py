from fastapi import Request, Response, status
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.exc import IntegrityError


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except IntegrityError as e:
            return Response(
                status_code=status.HTTP_409_CONFLICT,
                content="Duplicate entry. Please check the unique constraints.",
            )
