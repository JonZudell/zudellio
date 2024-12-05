from typing import Dict
from uuid import uuid4

from pydantic import BaseModel, Field


class TupleSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    object_id: str
    relation_id: str
    user_id: str
