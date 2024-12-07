from typing import Optional
from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from mangum import Mangum
from pydantic import BaseModel, EmailStr
from utilities.logging_config import get_logger_adapter
from persistence.contact import ContactFormModel
import json
app = FastAPI()

class ContactRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    message: str

@app.post("/contact")
async def healthcheck(
    _: Request,
    contact_request: ContactRequest = Depends(ContactRequest),
):
    app.state.logger_adapter.info("contact posted to")
    contact = contact_request.model_dump()
    app.state.logger_adapter.info(contact)
    return JSONResponse(content=contact, status_code=200)

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