from typing import Any, Dict
from uuid import UUID, uuid4

from pydantic import BaseModel, Field
from pynamodb.attributes import MapAttribute, UnicodeAttribute


class OrganizationSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    relation_ids: Dict[str, str]  # e.g., {"owner": "user", "viewer": "user"}
