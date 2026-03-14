from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import User


class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        cookie_name = getattr(settings, "JWT_AUTH_COOKIE", "access_token")
        raw_token = request.COOKIES.get(cookie_name)

        if raw_token is None:
            return None

        return self._validate_token(raw_token)

    def _validate_token(self, raw_token):
        try:
            validated = AccessToken(raw_token)
        except TokenError as e:
            raise AuthenticationFailed(str(e))

        user_id = validated.get("user_id")
        if user_id is None:
            raise AuthenticationFailed("Token contains no user_id claim")

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found")

        if not user.is_active:
            raise AuthenticationFailed("User is inactive")

        return user, validated

    def authenticate_header(self, request):
        return "Cookie"