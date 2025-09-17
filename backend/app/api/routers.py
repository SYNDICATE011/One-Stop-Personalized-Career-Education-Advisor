from fastapi import APIRouter

from .v1.users import user_router
from .v1.aptitude import aptitude
from .v1.ai_recommendation import ai

api_router = APIRouter()

api_router.include_router(
    user_router,
    prefix='/v1/user',
    tags=['users']
)
api_router.include_router(
    aptitude,
    prefix='/v1/aptitude',
    tags=['Questions']
)
api_router.include_router(
    ai,
    prefix='/v1/ai',
    tags=['AI recommendations']
)


__all__ = ['api_router']
