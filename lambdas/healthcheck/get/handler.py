from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse, Response
from mangum import Mangum

app = FastAPI()

@app.get("/healthcheck")
async def healthcheck():
    return JSONResponse(content={"status": "healthy"}, status_code=200)

mangum_app = Mangum(app, api_gateway_base_path="/healthcheck")

def lambda_handler(event, context):
    return mangum_app(event, context)