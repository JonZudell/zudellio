from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

import argon2
import phonenumbers
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex
from pynamodb.models import Model
from zxcvbn import zxcvbn

from persistence.attributes import UUIDAttribute
from utilities.crypto import PEPPER
from utilities.logging_config import setup_logging

logger = setup_logging(__name__)
argon2_hasher = argon2.PasswordHasher()


class EmailIndex(GlobalSecondaryIndex):  # type: ignore
    class Meta:
        index_name = "email_index"
        read_capacity_units = 1
        write_capacity_units = 1
        projection = AllProjection()

    email = UnicodeAttribute(hash_key=True)


class UserModel(Model):
    class Meta:
        table_name = "users"
        region = "us-east-1"

    sub = UUIDAttribute(hash_key=True)
    email = UnicodeAttribute()
    password = UnicodeAttribute()
    mfa_preference = UnicodeAttribute()
    sms_number = UnicodeAttribute()
    email_index = EmailIndex()

    def to_schema(self) -> "UserSchema":
        return UserSchema.model_validate(self)


class PendingUserModel(UserModel):
    exp = UTCDateTimeAttribute(
        default=lambda: datetime.now(timezone.utc) + timedelta(hours=12)
    )

    def to_schema(self) -> "PendingUserSchema":
        return PendingUserSchema.model_validate(self)


class UserSchema(BaseModel):
    _model = UserModel
    model_config = ConfigDict(from_attributes=True)

    # key
    sub: UUID = Field(default_factory=uuid4)
    # required
    email: EmailStr = Field(exclude=True)
    password: str = Field(exclude=True)
    # optional
    mfa_preference: str = Field(default="email", exclude=True)
    sms_number: str | None = Field(default=None, exclude=True)

    @field_validator("email")
    def lower_email(cls, v: str) -> str:
        return v.lower()

    @field_validator("password", mode="before")
    def hash_password(cls, v: str) -> str:
        if len(v) > 1024:
            raise ValueError(
                "Max password length is 1024 characters. This is to prevent abuse; your password is hashed with argon2 and a pepper."
            )
        password_strength = zxcvbn(v)
        if password_strength["score"] < 3:
            raise ValueError(password_strength["feedback"])
        return argon2_hasher.hash(v + PEPPER)

    def check_password(self, password: str) -> bool:
        try:
            return argon2_hasher.verify(self.password, password + PEPPER)
        except argon2.exceptions.VerifyMismatchError:
            return False

    def validate_phone_number(self) -> bool:
        """Validate the phone number using the phonenumbers library."""
        try:
            if isinstance(self.sms_number, str):
                parsed_number = phonenumbers.parse(self.sms_number, None)
                return phonenumbers.is_valid_number(parsed_number)
            return False
        except phonenumbers.phonenumberutil.NumberParseException:
            return False

    def to_model(self) -> UserModel:
        instance = self._model(**self.model_dump())
        if isinstance(instance, self._model):
            return instance
        raise Exception(f"Could not unpack {self} into {self._model}")


class PendingUserSchema(UserSchema):
    _model = PendingUserModel
    exp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc) + timedelta(hours=1)
    )

    def to_model(self) -> PendingUserModel:
        instance = self._model(**self.model_dump())
        if isinstance(instance, self._model):
            return instance
        raise Exception(f"Could not unpack {self} into {self._model}")
