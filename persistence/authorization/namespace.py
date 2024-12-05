from typing import Dict
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class NamespaceSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    relations: Dict[str, str]  # e.g., {"owner": "user", "viewer": "user"}
