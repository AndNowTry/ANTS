from rest_framework.response import Response


def success_response(data=None, status_code=200):
    return Response(
        {
            "status": "success",
            "data": data
        },
        status=status_code
    )


