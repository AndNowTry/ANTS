from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from core.responses import success_response
from .serializers import LoginSerializer, RegisterSerializer, ProfileSerializer
from .cookies import set_auth_cookies, clear_auth_cookies


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return success_response(
            data={"message": "Registration successful."},
            status_code=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        response = success_response(
            data={"message": "Login successful."},
            status_code=status.HTTP_200_OK,
        )
        set_auth_cookies(response, access_token, refresh_token)
        return response


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_raw = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)
        if not refresh_raw:
            raise AuthenticationFailed("Refresh token cookie not found")

        try:
            refresh = RefreshToken(refresh_raw)
            new_access = str(refresh.access_token)

            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS"):
                refresh.set_jti()
                refresh.set_exp()
                new_refresh = str(refresh)
            else:
                new_refresh = refresh_raw

        except TokenError as e:
            raise AuthenticationFailed(str(e))

        response = success_response(data={"message": "Token refreshed"})
        set_auth_cookies(response, new_access, new_refresh)
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_raw = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)
        if refresh_raw:
            try:
                RefreshToken(refresh_raw).blacklist()
            except (TokenError, Exception):
                pass

        response = success_response(data={"message": "Logged out successfully"})
        clear_auth_cookies(response)
        return response


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user.profile)
        return success_response(
            data={
                'message': 'User profile found',
                'data': serializer.data
            }
        )

    def post(self, request):
        serializer = ProfileSerializer(
            request.user.profile,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success_response(
            data={
                'message': 'User profile changed',
                'data': serializer.data
            }
        )