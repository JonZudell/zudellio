import json
import traceback
from datetime import datetime, timedelta, timezone
from typing import Awaitable, Callable

import argon2
from fastapi import Request, Response
from fastapi.responses import RedirectResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from persistence.authentication.session import SessionModel, SessionSchema
from utilities.crypto import PEPPER, decrypt_and_verify_token
from utilities.logging_config import setup_logging

logger = setup_logging(__name__)

argon2_hasher = argon2.PasswordHasher()
# Define your pre-authentication token
JWT = "Authorization"
FGP = "fgp"


class SSRWhenResponseTypeHTMLMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        return await call_next(request)


class AuthorizationMiddleware(BaseHTTPMiddleware):
    session_model = SessionModel
    aal_requirement = 1

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        if request.session.aal < self.aal_requirement:
            # TODO: create aal challenge, set location header to /challenge?redirect=this.endpoint
            return RedirectResponse()
        return await call_next(request)


class AuthenticationMiddleware(BaseHTTPMiddleware):
    session_model = SessionModel

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        session: SessionSchema
        # Session Verification
        response_or_session, jwt, fgp = self.extract_session_or_error(request=request)
        if isinstance(response_or_session, Response):
            return response_or_session
        session = response_or_session
        # Nonce Verification
        if session.nonce != jwt["nonce"]:
            return JSONResponse(content={"event": "nonce_mismatch"}, status_code=401)

        # Session Expirations
        err_response = self.handle_expirations(request=request, session=session)
        if isinstance(err_response, Response):
            return err_response

        # Attach session to request state
        request.state.session = session
        response = await call_next(request)

        # Update the session
        jwt, fgp, _ = session.refresh_tokens()
        session.to_model().update(
            actions=[
                SessionModel.fgp.set(fgp),
                SessionModel.lat.set(datetime.now(timezone.utc)),
            ]
        )

        response.headers["Authorization"] = jwt
        response.set_cookie(FGP, fgp)
        return response

    def handle_expirations(
        self, request: Request, session: SessionSchema
    ) -> None | Response:
        now = datetime.now(timezone.utc)
        # Expiration over rules all and should only be set at session initialization
        # Otherwise max session is 30 days
        if now >= session.exp or now >= session.iat + timedelta(days=30):
            return RedirectResponse("/signin")

        # if the session is remembered and access level is
        if not session.remembered:
            if now >= session.rat + timedelta(minutes=15):
                return RedirectResponse("/signin")
            elif now >= session.iat + timedelta(hours=12):
                return RedirectResponse("/signin")
        else:
            if session.aal == 2:
                if now >= session.lat + timedelta(
                    minutes=30
                ) or now >= session.uat + timedelta(hours=12):
                    session.aal = 1
            elif session.aal == 3:
                if now >= session.lat + timedelta(
                    minutes=15
                ) or now >= session.uat + timedelta(hours=12):
                    session.aal = 1
        return None

    def get_jwt(self, request: Request) -> dict | Response:
        jwt: dict | str | None = request.headers.get(JWT)
        if jwt == "" or jwt is None:
            return JSONResponse(
                status_code=401,
                content={"detail": f"Expected bearer token as Header."},
            )
        if not isinstance(jwt, str):
            return JSONResponse(status_code=401, content={"detail": "Invalid Token"})
        jwt = decrypt_and_verify_token(jwt.replace("Bearer", ""))
        if not isinstance(jwt, dict):
            return JSONResponse(
                status_code=401, content={"detail": "Invalid Fingerprint"}
            )
        return jwt

    def get_fgp(self, request: Request) -> dict | Response:
        fgp: dict | str | None = request.cookies.get(FGP)
        if fgp == "" or fgp is None:
            return JSONResponse(
                status_code=401,
                content={"detail": f"Expected fingerprint as cookie."},
            )
        if not isinstance(fgp, str):
            return JSONResponse(
                status_code=401, content={"detail": "Invalid Fingerprint"}
            )
        fgp = decrypt_and_verify_token(fgp)
        if not isinstance(fgp, dict):
            return JSONResponse(
                status_code=401, content={"detail": "Invalid Fingerprint"}
            )
        return fgp

    def get_verified_session(self, jwt: dict, fgp: dict) -> SessionSchema | Response:
        if jwt["typ"] == "auth":
            model = self.session_model
            session = model.get(jwt["jti"]).to_schema()
            argon2_hasher.verify(
                jwt["fgp"].encode("utf-8"),
                fgp["fgp"].encode("utf-8") + PEPPER.encode("utf-8"),
            )
            return session
        else:
            return JSONResponse(
                status_code=401, content={"detail": "Invalid Token Type"}
            )

    def extract_session_or_error(
        self, request: Request
    ) -> SessionSchema | JSONResponse:
        try:
            logger.critical(request)
            jwt = self.get_jwt(request=request)
            if isinstance(jwt, JSONResponse):
                return jwt, None, None
            fgp = self.get_fgp(request=request)
            if isinstance(fgp, JSONResponse):
                return fgp, None, None
            if jwt == None or fgp == None:
                return (
                    JSONResponse(
                        status_code=401, content={"detail": "jwt and fgp required"}
                    ),
                    None,
                    None,
                )
            return self.get_verified_session(jwt, fgp), jwt, fgp
        except Exception as e:
            return (
                JSONResponse(status_code=401, content={"detail": "Invalid Token"}),
                None,
                None,
            )
