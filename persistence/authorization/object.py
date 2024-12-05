from typing import Dict
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class ObjectSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    namespace: str
    object_id: str
