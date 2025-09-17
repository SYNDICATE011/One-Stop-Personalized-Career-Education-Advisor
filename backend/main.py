from fastapi import FastAPI, Response, status, Depends
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.api import api_router
from app.core.authentication import get_current_user
from app.database.user_model import User

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get('/favicon.ico')
async def favicon():
    """Prevents from the favicon 404 logs"""
    return Response(status_code=status.HTTP_200_OK)


@app.get('/')
async def health(user: User = Depends(get_current_user)):
    return user
