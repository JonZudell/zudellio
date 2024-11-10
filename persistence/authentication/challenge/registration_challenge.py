import uuid
from datetime import datetime, timedelta, timezone

import pyotp
from pydantic import BaseModel, EmailStr, Field
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.models import Model


class RegistrationChallengeSchema(BaseModel):
    # key
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    # required
    sub: str
    email: EmailStr
    # optional
    otp: str = Field(default_factory=lambda: pyotp.TOTP(pyotp.random_base32()).now())
    exp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc) + timedelta(hours=1)
    )


class RegistrationChallengeModel(Model):
    class Meta:
        table_name = "emails"
        region = "us-east-1"

    id = UnicodeAttribute(hash_key=True)
    sub = UnicodeAttribute()
    email = UnicodeAttribute()
    otp = UnicodeAttribute()
    exp = UTCDateTimeAttribute()
