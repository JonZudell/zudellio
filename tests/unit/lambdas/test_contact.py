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

    async def test_contact(
        self
    ) -> None:
        # Valid input
        response = self.client.post(
            "/contact",
            json={
            "name": "John Doe",
            "email": "john.doe@gmail.com",
            "message": "Hello, World!"
            })
        if response.status_code != 200:
            print(response.json())
            assert False

    async def test_missing_name(
            self
    ):
        # Missing name
        response = self.client.post(
            "/contact",
            json={
                "email": "john.doe@gmail.com",
                "message": "Hello, World!"
            })
        assert response.status_code == 422  # Missing name should return 422

    async def test_invalid_email(
            self
    ):
        # Invalid email
        response = self.client.post(
            "/contact",
            json={
                "name": "John Doe",
                "email": "invalid-email",
                "message": "Hello, World!"
            })
        assert response.status_code == 422  # Invalid email should return 422

    async def test_missing_email(
            self
    ):
        # Missing message
        response = self.client.post(
            "/contact",
            json={
                "name": "John Doe",
                "email": "john.doe@gmail.com"
            })
        assert response.status_code == 422  # Missing message should return 422
