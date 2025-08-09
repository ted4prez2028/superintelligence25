import os, time
from fastapi import Request, HTTPException
from jose import jwt
import httpx

REQUIRE = os.getenv("REQUIRE_AUTH","false").lower() == "true"
CLERK_ISSUER = os.getenv("CLERK_ISSUER")
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
_cache = {"exp":0, "keys":None}

async def _jwks():
    if not CLERK_JWKS_URL: return None
    import json
    now = time.time()
    if _cache["keys"] and _cache["exp"] > now: return _cache["keys"]
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(CLERK_JWKS_URL); r.raise_for_status()
        data = r.json()
        _cache.update({"keys":data,"exp":now+3600})
        return data

async def verify_request(request: Request):
    if not REQUIRE: return None
    auth = request.headers.get("Authorization") or request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(401, "Missing bearer token")
    token = auth.split(" ",1)[1]

    if CLERK_ISSUER and CLERK_JWKS_URL:
        keys = await _jwks()
        try:
            unverified = jwt.get_unverified_header(token); kid = unverified.get("kid")
            key = next((k for k in keys.get("keys",[]) if k.get("kid")==kid), None)
            if not key: raise Exception("JWK not found")
            claims = jwt.decode(token, key, options={"verify_aud": False}, algorithms=[key.get("alg","RS256")], issuer=CLERK_ISSUER)
            return claims
        except Exception as e:
            raise HTTPException(401, f"Invalid Clerk token: {e}")

    if GOOGLE_CLIENT_ID:
        # lightweight verify: ensure aud matches
        try:
            claims = jwt.get_unverified_claims(token)
            if claims.get("aud") != GOOGLE_CLIENT_ID:
                raise Exception("aud mismatch")
            return claims
        except Exception as e:
            raise HTTPException(401, f"Invalid Google token: {e}")

    raise HTTPException(401, "Auth required")
