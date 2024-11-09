import pytest
from fastapi.testclient import TestClient

from lambdas.contact.post import handler

@pytest.mark.asyncio
class TestContactHandler:

    @pytest.fixture(autouse=True)
    def setup_method(
        self
    ) -> None:
        self.client = TestClient(handler.app)
