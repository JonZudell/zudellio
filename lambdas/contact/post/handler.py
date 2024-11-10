from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from mangum import Mangum
from pydantic import BaseModel, EmailStr

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str

app = FastAPI()

@app.post("/contact")
async def lambda_handler(
    _: Request,
    contact_request: ContactRequest
) -> Response:
    return JSONResponse(content={"status": "healthy"}, status_code=200)

mangum_app = Mangum(app)