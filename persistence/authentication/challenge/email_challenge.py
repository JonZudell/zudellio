from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

import pyotp
from pydantic import BaseModel, EmailStr, Field
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.models import Model

from persistence.attributes import UUIDAttribute


class EmailChallengeSchema(BaseModel):
    # key
    id: UUID = Field(default_factory=uuid4)
    # required
    sub: UUID = Field(default_factory=uuid4)
    email: EmailStr
    # optional
    otp: str = Field(default_factory=lambda: pyotp.TOTP(pyotp.random_base32()).now())
    exp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc) + timedelta(hours=1)
    )


class EmailChallengeModel(Model):
    class Meta:
        table_name = "emails"
        region = "us-east-1"

    id = UUIDAttribute(hash_key=True)
    sub = UUIDAttribute()
    email = UnicodeAttribute()
    otp = UnicodeAttribute()
    exp = UTCDateTimeAttribute()
