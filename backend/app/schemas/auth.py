from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class SignupRequest(BaseModel):
    """Data the signup form sends."""

    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    # bcrypt only uses the first 72 bytes, so we cap the length at 72
    password: str = Field(min_length=8, max_length=72)

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, value: str) -> str:
        # Stops "Test@x.com" and "test@x.com" becoming two accounts
        return value.strip().lower()

    @field_validator("full_name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        return value.strip()


class LoginRequest(BaseModel):
    """Data the login form sends."""

    email: EmailStr
    password: str = Field(min_length=1, max_length=72)

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, value: str) -> str:
        return value.strip().lower()


class UserOut(BaseModel):
    """What we send back about a user. Note: no password_hash here."""

    # from_attributes lets Pydantic read values straight from a SQLAlchemy User object
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    role: str
    created_at: datetime


class TokenResponse(BaseModel):
    """What login and signup return."""

    access_token: str
    token_type: str = "bearer"
    user: UserOut
