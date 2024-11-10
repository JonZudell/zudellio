from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse, Response
from mangum import Mangum

app = FastAPI()
@app.get("/healthcheck")
def lambda_handler(
    _: Request,
) -> Response:
    return JSONResponse(content={"status" : "healthy"},status_code=200)

mangum_app = Mangum(app)