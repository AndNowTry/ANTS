from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    message = None
    code = "ERROR"

    if isinstance(response.data, dict):
        if "detail" in response.data:
            message = response.data["detail"]
        else:
            message = response.data
    else:
        message = str(response.data)

    response.data = {
        "status": "error",
        "error": {
            "code": code,
            "message": message
        }
    }
    return response