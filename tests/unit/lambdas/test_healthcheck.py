import pytest
from fastapi.testclient import TestClient

from lambdas.healthcheck.get import handler

class MockLambdaContext:
    def __init__(self):
        self.aws_request_id = "test_request_id"
        self.log_group_name = "test_log_group"
        self.log_stream_name = "test_log_stream"
        self.function_name = "test_function"
        self.memory_limit_in_mb = 128
        self.function_version = "1"
        self.invoked_function_arn = "arn:aws:lambda:us-west-2:123456789012:function:test_function"
        self.client_context = None
        self.identity = None

    def get_remaining_time_in_millis(self):
        return 300000  # 5 minutes

class TestHealthcheckHandler:
    @pytest.fixture(autouse=True)
    def setup_method(self) -> None:
        self.client = TestClient(handler.app)

    @pytest.mark.asyncio
    async def test_get_healthcheck(self) -> None:
        response = self.client.get("/healthcheck")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}

    def test_lambda_handler(self) -> None:
        request = {
            "Records": [
                {
                    "cf": {
                        "config": {"distributionId": "EXAMPLE"},
                        "request": {
                            "uri": "/healthcheck",
                            "querystring": "auth=test&foo=bar",
                            "method": "GET",
                            "clientIp": "2001:cdba::3257:9652",
                            "headers": {
                                "host": [{"key": "Host", "value": "d123.cf.net"}],
                                "user-agent": [
                                    {"key": "User-Agent", "value": "Test Agent"}
                                ],
                                "user-name": [
                                    {"key": "User-Name", "value": "aws-cloudfront"}
                                ],
                            },
                        },
                    }
                }
            ]
        }
        context = MockLambdaContext()
        response = handler.lambda_handler(request, context)
        print(response)
        assert response["status"] == 200
        assert response["body"] == '{"status":"healthy"}'

    def test_lambda_handler_invalid_path(self) -> None:
        request = {
            "Records": [
                {
                    "cf": {
                        "config": {"distributionId": "EXAMPLE"},
                        "request": {
                            "uri": "/invalid",
                            "querystring": "auth=test&foo=bar",
                            "method": "GET",
                            "clientIp": "2001:cdba::3257:9652",
                            "headers": {
                                "host": [{"key": "Host", "value": "d123.cf.net"}],
                                "user-agent": [
                                    {"key": "User-Agent", "value": "Test Agent"}
                                ],
                                "user-name": [
                                    {"key": "User-Name", "value": "aws-cloudfront"}
                                ],
                            },
                        },
                    }
                }
            ]
        }

        context = MockLambdaContext()
        response = handler.lambda_handler(request, context)
        assert response["status"] == 404
        assert response["body"] == '{"detail":"Not Found"}'

