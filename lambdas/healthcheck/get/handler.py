from fastapi import FastAPI
from fastapi.responses import JSONResponse
from mangum import Mangum
from utilities.logging_config import get_logger_adapter

app = FastAPI()

@app.post("/healthcheck")
async def healthcheck():
    app.state.logger_adapter.info("healthcheck posted to")
    return JSONResponse(content={"status": "healthy"}, status_code=200)

mangum_app = Mangum(app, api_gateway_base_path="/")

def lambda_handler(event, context):
    extra = {
        "aws_request_id": context.aws_request_id,
        "function_name": context.function_name,
        "function_version": context.function_version,
        "aws_region": context.invoked_function_arn.split(":")[3],
    }
    app.state.logger_adapter = get_logger_adapter(extra=extra)
    app.state.logger_adapter.info("Lambda function invoked")
    app.state.logger_adapter.info(event)
    app.state.logger_adapter.info(context)
    return mangum_app(event, context)