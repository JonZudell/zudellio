from fastapi import Depends, FastAPI, Request, Response
from fastapi.responses import JSONResponse, Response
from mangum import Mangum
from pydantic import BaseModel

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

app = FastAPI()
@app.post("/contact")
def lambda_handler(
    _: Request,
    contact_request: ContactRequest = Depends(ContactRequest),
) -> Response:
    return JSONResponse(content={"status" : "healthy"},status_code=200)

mangum_app = Mangum(app)