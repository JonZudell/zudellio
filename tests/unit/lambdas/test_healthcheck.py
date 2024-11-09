import pytest
from fastapi.testclient import TestClient

from lambdas.healthcheck.get import handler

@pytest.mark.asyncio
class TestHealthcheckHandler:

    @pytest.fixture(autouse=True)
    def setup_method(
        self
    ) -> None:
        self.client = TestClient(handler.app)

    async def test_get_healthcheck(
        self
    ) -> None:
        response = self.client.get("/healthcheck")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}
