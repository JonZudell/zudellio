from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import uuid4

import argon2
from pydantic import BaseModel, Field, PrivateAttr
from pynamodb.attributes import (
    BooleanAttribute,
    NumberAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex
from pynamodb.models import Model

from utilities.crypto import (
    PEPPER,
    generate_secure_base64_secret,
    get_keys,
    sign_and_encrypt_token,
)
from utilities.logging_config import setup_logging

logger = setup_logging(__name__)

private_key = get_keys()
argon2_hasher = argon2.PasswordHasher()


class SubIndex(GlobalSecondaryIndex):  # type: ignore
    class Meta:
        index_name = "sub_index"
        read_capacity_units = 1
        write_capacity_units = 1
        projection = AllProjection()

    sub = UnicodeAttribute(hash_key=True)


class SessionModel(Model):
    class Meta:
        table_name = "sessions"
        region = "us-east-1"

    jti = UnicodeAttribute(hash_key=True)
    sub = UnicodeAttribute()
    fgp = UnicodeAttribute()
    hashed_fgp = UnicodeAttribute()
    lat = UTCDateTimeAttribute()
    iat = UTCDateTimeAttribute()
    rat = UTCDateTimeAttribute()
    nbf = UTCDateTimeAttribute()
    exp = UTCDateTimeAttribute()
    uat = UTCDateTimeAttribute()
    aal = NumberAttribute()
    nonce = UnicodeAttribute()
    r_nonce = UnicodeAttribute()
    intent = UnicodeAttribute(null=True)
    remembered = BooleanAttribute()
    sub_index = SubIndex()

    def to_schema(self) -> "SessionSchema":
        return SessionSchema.model_validate(self, from_attributes=True)

class SessionSchema(BaseModel):
    _model = PrivateAttr(SessionModel)
    # key
    jti: str = Field(default_factory=lambda: str(uuid4()))

    # required
    sub: str

    # optional
    nonce: str = Field(default_factory=lambda: str(uuid4()))
    r_nonce: str = Field(default_factory=lambda: str(uuid4()))
    fgp: str
    hashed_fgp: str = Field(default="")
    iat: datetime
    nbf: datetime
    rat: datetime
    lat: datetime
    exp: datetime
    uat: datetime
    aal: int = Field(default=1)
    intent: str | None = Field(default=None)
    remembered: bool = False

    def __init__(self, **data: Any) -> None:
        now: datetime = datetime.now(timezone.utc)
        if "fgp" not in data:
            data["fgp"] = generate_secure_base64_secret()
            data["hashed_fgp"] = argon2_hasher.hash(
                data["fgp"].encode("utf-8") + PEPPER.encode("utf-8")
            )
        if "lat" not in data:
            data["lat"] = now
        if "iat" not in data:
            data["iat"] = now
        if "uat" not in data:
            data["uat"] = now
        if "rat" not in data:
            data["rat"] = now
        if "nbf" not in data:
            data["nbf"] = now
        if "exp" not in data:
            if "remembered" not in data or data["remembered"] == False:
                data["exp"] = now + timedelta(hours=12)
            else:
                data["exp"] = now + timedelta(days=30)
        if "aal" not in data:
            data["aal"] = 1
        super().__init__(**data)

    def refresh_tokens(self) -> tuple[str, str, str]:
        self.gen_fingerprint()
        self.gen_nonce()
        self.gen_r_nonce()
        return self.get_tokens()

    def gen_fingerprint(self) -> None:
        self.fgp = generate_secure_base64_secret()
        self.hashed_fgp = argon2_hasher.hash(
            self.fgp.encode("utf-8") + PEPPER.encode("utf-8")
        )

    def gen_nonce(self) -> None:
        self.nonce = str(uuid4())

    def gen_r_nonce(self) -> None:
        self.r_nonce = str(uuid4())

    def get_jwt(self) -> str:
        payload = {
            "typ": "auth",
            "jti": self.jti,
            "sub": self.sub,
            "lat": self.lat.isoformat(),
            "iat": self.iat.isoformat(),
            "uat": self.uat.isoformat(),
            "rat": self.rat.isoformat(),
            "nbf": self.nbf.isoformat(),
            "exp": self.exp.isoformat(),
            "aal": self.aal,
            "nonce": self.nonce,
            "fgp": self.hashed_fgp,
            "intent": self.intent,
        }
        logger.warning(payload)
        return sign_and_encrypt_token(payload)

    def get_fgp(self) -> str:
        return sign_and_encrypt_token(
            {
                "typ": "fgp",
                "fgp": self.fgp,
                "iat": self.rat.isoformat(),
                "exp": (self.rat + timedelta(minutes=15)).isoformat(),
            }
        )

    def get_refresh(self) -> str:
        return sign_and_encrypt_token(
            {
                "typ": "refresh",
                "iat": self.iat.isoformat(),
                "exp": self.exp.isoformat(),
                "nonce": self.r_nonce,
            }
        )

    def get_tokens(self) -> tuple[str, str, str]:
        return (
            self.get_jwt(),
            self.get_fgp(),
            self.get_refresh(),
        )

    def to_model(self) -> SessionModel:
        instance = self._model(**self.model_dump())
        if isinstance(instance, self._model):
            return instance


class PendingSessionModel(Model):
    class Meta:
        table_name = "pending_sessions"
        region = "us-east-1"

    jti = UnicodeAttribute(hash_key=True)
    sub = UnicodeAttribute()
    fgp = UnicodeAttribute()
    hashed_fgp = UnicodeAttribute()
    iat = UTCDateTimeAttribute()
    rat = UTCDateTimeAttribute()
    nbf = UTCDateTimeAttribute()
    exp = UTCDateTimeAttribute()
    nonce = UnicodeAttribute()
    r_nonce = UnicodeAttribute()
    intent = UnicodeAttribute(null=True)

    def to_schema(self) -> "PendingSessionSchema":
        return PendingSessionSchema.model_validate(self, from_attributes=True)


class PendingSessionSchema(BaseModel):
    _model = PrivateAttr(PendingSessionModel)
    # key
    jti: str = Field(default_factory=lambda: str(uuid4()))

    # required
    sub: str

    # optional
    nonce: str = Field(default_factory=lambda: str(uuid4()))
    r_nonce: str = Field(default_factory=lambda: str(uuid4()))
    fgp: str = Field(default_factory=generate_secure_base64_secret)
    hashed_fgp: str = Field(default="")
    iat: datetime
    rat: datetime
    nbf: datetime
    exp: datetime

    def __init__(self, **data: Any) -> None:
        now: datetime = datetime.now(timezone.utc)
        if "iat" not in data:
            data["iat"] = now
        if "rat" not in data:
            data["rat"] = now
        if "nbf" not in data:
            data["nbf"] = now
        if "exp" not in data:
            data["exp"] = data["nbf"] + timedelta(hours=12)
        super().__init__(**data)

    def refresh_tokens(self) -> tuple[str, str, str]:
        self.gen_fingerprint()
        self.gen_nonce()
        self.gen_r_nonce()
        return self.get_tokens()

    def gen_fingerprint(self) -> None:
        self.fgp = generate_secure_base64_secret()
        self.hashed_fgp = argon2_hasher.hash(
            self.fgp.encode("utf-8") + PEPPER.encode("utf-8")
        )

    def gen_nonce(self) -> None:
        self.nonce = str(uuid4())

    def gen_r_nonce(self) -> None:
        self.r_nonce = str(uuid4())

    def get_jwt(self) -> str:
        return sign_and_encrypt_token(
            {
                "typ": "pending",
                "jti": self.jti,
                "fgp": self.hashed_fgp,
                "iat": self.iat.isoformat(),
            }
        )

    def get_fgp(self) -> str:
        return sign_and_encrypt_token(
            {
                "typ": "fgp",
                "fgp": self.fgp,
                "iat": self.rat.isoformat(),
                "exp": (self.rat + timedelta(minutes=15)).isoformat(),
            }
        )

    def get_refresh(self) -> str:
        return sign_and_encrypt_token(
            {
                "typ": "refresh",
                "iat": self.iat.isoformat(),
                "exp": self.exp.isoformat(),
                "nonce": self.r_nonce,
            }
        )

    def get_tokens(self) -> tuple[str, str, str]:
        return (
            self.get_jwt(),
            self.get_fgp(),
            self.get_refresh(),
        )

    def to_model(self) -> PendingSessionModel:
        instance = self._model(**self.model_dump())
        if isinstance(instance, self._model):
            return instance
