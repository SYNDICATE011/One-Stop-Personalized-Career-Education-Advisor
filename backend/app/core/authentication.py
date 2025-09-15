from clerk_backend_api import Clerk
from fastapi import FastAPI, Depends, HTTPException, Header


from app.core.config import settings

clerk_sdk = Clerk(bearer_auth=settings.CLERK_SECRETE_KEY)


def get_current_user(authorization: str = Header(...)):

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.split(" ")[1]

    try:
        session = clerk_sdk.sessions.verify_token(token)
        user_id = session.user_id
        user = clerk_sdk.users.get_user(user_id)
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
