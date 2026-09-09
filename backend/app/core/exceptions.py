from fastapi import HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from typing import Any, Dict, Optional

class MetroAPIException(HTTPException):
    def __init__(
        self,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        code: str = "BAD_REQUEST",
        message: str = "An error occurred",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=message)
        self.code = code
        self.message = message
        self.details = details or {}

def format_error_response(code: str, message: str, details: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "details": details or {}
        }
    }

def format_success_response(data: Any = None, message: str = "Operation successful") -> Dict[str, Any]:
    return {
        "success": True,
        "message": message,
        "data": data if data is not None else {}
    }

async def metro_exception_handler(request: Request, exc: MetroAPIException):
    return JSONResponse(
        status_code=exc.status_code,
        content=format_error_response(exc.code, exc.message, exc.details)
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    details = {"errors": errors}
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=format_error_response("VALIDATION_ERROR", "Invalid payload or parameter", details)
    )

async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=format_error_response("HTTP_ERROR", str(exc.detail))
    )
