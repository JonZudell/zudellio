from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

import pyotp
from pydantic import BaseModel, Field
from pydantic.networks import PhoneNumber
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.models import Model


class SMSChallengeSchema(BaseModel):
    # key
    id: str = Field(default_factory=lambda: str(uuid4()))
    # required
    sub: UUID
    sms: PhoneNumber
    # optional
    otp: str = Field(default_factory=lambda: pyotp.TOTP(pyotp.random_base32()).now())
    exp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc) + timedelta(hours=1)
    )


class SMSChallengeModel(Model):
    class Meta:
        table_name = "sms"
        region = "us-east-1"

    id = UnicodeAttribute(hash_key=True)

    sub = UnicodeAttribute()
    sms = UnicodeAttribute()
    otp = UnicodeAttribute()
    exp = UTCDateTimeAttribute()
