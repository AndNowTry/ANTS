from django.conf import settings


def set_auth_cookies(response, access_token, refresh_token):
    access_max_age = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
    refresh_max_age = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())

    _cookie_kwargs = dict(
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,
        samesite=settings.JWT_COOKIE_SAMESITE,
    )

    response.set_cookie(
        key=settings.JWT_ACCESS_COOKIE_NAME,
        value=str(access_token),
        max_age=access_max_age,
        path="/",
        **_cookie_kwargs,
    )
    response.set_cookie(
        key=settings.JWT_REFRESH_COOKIE_NAME,
        value=str(refresh_token),
        max_age=refresh_max_age,
        path="/api/auth/refresh/",
        **_cookie_kwargs,
    )
    return response


def clear_auth_cookies(response):
    response.delete_cookie(settings.JWT_ACCESS_COOKIE_NAME, path="/")
    response.delete_cookie(settings.JWT_REFRESH_COOKIE_NAME, path="/api/auth/refresh/")
    return response