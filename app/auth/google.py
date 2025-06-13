import os
from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.config import Config
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel
from typing import Optional

# Load environment variables
config = Config(".env")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID") or config("GOOGLE_CLIENT_ID", default="")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET") or config("GOOGLE_CLIENT_SECRET", default="")

if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
    raise ValueError("Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.")

# OAuth setup
oauth = OAuth()
oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile",
        "redirect_uri": "http://127.0.0.1:8500/api/auth/callback",
        "prompt": "select_account",
    },
)

# Router
router = APIRouter(prefix="/api/auth", tags=["auth"])

# Models
class UserInfo(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    is_authenticated: bool = True

# Helper functions
def get_current_user(request: Request) -> UserInfo:
    user = request.session.get("user")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return UserInfo(**user)

# Routes
@router.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for("auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/callback")
async def auth_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")
        if user_info:
            request.session["user"] = {
                "id": user_info["sub"],
                "email": user_info["email"],
                "name": user_info["name"],
                "picture": user_info.get("picture"),
                "is_authenticated": True
            }
            # Redirect to home page after successful login
            return RedirectResponse(url="/")
        raise HTTPException(status_code=400, detail="Could not fetch user info")
    except OAuthError as error:
        return RedirectResponse(url=f"/?error={error.error}")

@router.get("/logout")
async def logout(request: Request):
    request.session.pop("user", None)
    return RedirectResponse(url="/")

@router.get("/user")
async def get_user(user: UserInfo = Depends(get_current_user)):
    return user
