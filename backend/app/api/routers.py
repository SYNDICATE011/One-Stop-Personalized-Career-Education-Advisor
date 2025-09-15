from fastapi import APIRouter

from .v1.users import user_router

api_router = APIRouter()

api_router.include_router(
    user_router,
    prefix='v1/user',
    tags=['users']
)


__all__ = ['api_router']
