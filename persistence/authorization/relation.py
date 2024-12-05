from typing import Dict
from uuid import uuid4

from pydantic import BaseModel, Field
from pynamodb.attributes import UnicodeAttribute
from pynamodb.models import Model

from .object import ObjectSchema


class RelationSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    object_id: str
    relation_id: str
    user_id: str
