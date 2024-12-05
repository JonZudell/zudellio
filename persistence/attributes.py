from uuid import UUID

from pynamodb.attributes import UnicodeAttribute


class UUIDAttribute(UnicodeAttribute):
    def serialize(self, value: UUID) -> str:
        if not isinstance(value, UUID):
            raise ValueError(f"Expected UUID, got {type(value)}")
        return str(value)

    def deserialize(self, value: str) -> UUID:
        return UUID(value)
