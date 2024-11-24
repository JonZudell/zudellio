import json
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse, Response
from mangum import Mangum
with open("./rewrites.json", "r") as f:
  rewrites = json.load(f)

app = FastAPI()
@app.post("/rewrite")
async def url_rewrite(request: Request) -> Response:
  body = await request.json()
  original_url = body.get("original_url")
  if not original_url:
    return JSONResponse(content={"error": "original_url is required"}, status_code=400)

  for rewrite in rewrites["rewrites"]:
    if rewrite["source"] == original_url:
      rewritten_url = rewrite["destination"]
      break
  # Perform URL rewrite logic here
  rewritten_url = original_url.replace("http://", "https://")

  return JSONResponse(content={"rewritten_url": rewritten_url}, status_code=200)

mangum_app = Mangum(app)