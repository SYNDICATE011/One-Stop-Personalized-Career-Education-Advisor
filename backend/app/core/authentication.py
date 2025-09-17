import httpx
from clerk_backend_api import Clerk, AuthenticateRequestOptions
from fastapi import FastAPI, Depends, HTTPException, Header, Request
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from app.database.user_model import User
from app.core.config import settings
from app.core.psql_connection import get_db

clerk_sdk = Clerk(bearer_auth=settings.CLERK_SECRETE_KEY)
auth_scheme = HTTPBearer()


def get_clerk_user(user_id: str):
    try:
        headers = {
            "Authorization": f"Bearer {settings.CLERK_SECRETE_KEY}",
            "Content-Type": "application/json"
        }
        url = f"https://api.clerk.dev/v1/users/{user_id}"

        response = httpx.get(url, headers=headers)
        response.raise_for_status()

        return response.json()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch user: {str(e)}")


def get_current_user(request: Request, db: Session = Depends(get_db)):

    try:
        request_state = clerk_sdk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=[
                    "http://localhost:8000", "http://localhost:5173"],
                jwt_key=settings.JWT_KEY
            )

        )
        if not request_state.is_signed_in:
            raise HTTPException(status_code=401, detail="invalid token")

        user_id = request_state.payload.get('sub')

        user = db.query(User).filter(User.clerk_id == user_id).first()
        if user:
            return user

        user = get_clerk_user(user_id)

        new_user = User(
            clerk_id=user['id'],
            email=user['email_addresses'][0]['email_address'],
            name=user['first_name'],
            picture=user['image_url'],
            is_verified=user['email_addresses'][0].get('verified', True),
            last_name=user['last_name'],
            first_name=user['first_name']

        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
