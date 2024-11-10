from typing import Generator
import pytest
from moto import mock_aws

@pytest.fixture(scope="session", autouse=True)
def mock_aws_session() -> Generator[None, None, None]:
    with mock_aws():
        yield