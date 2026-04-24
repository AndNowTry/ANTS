from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User, Profile
from test_payment.models import Subscription


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    def validate_username(self, value):
        if Profile.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        username = validated_data.pop("username")
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, username=username)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            request=self.context.get("request"),
            username=attrs["email"],
            password=attrs["password"],
        )
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled")
        attrs["user"] = user
        return attrs


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ("plan", "started_at", "expires_at", "is_active")
        read_only_fields = fields


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    subscriptions = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ("email", "username", "avatar", "level", "theme", "language", "subscriptions")
        read_only_fields = ("email",)

    def get_subscriptions(self, obj):
        subs = obj.user.subscriptions.filter(is_active=True).order_by("-started_at")
        return SubscriptionSerializer(subs, many=True).data

    def get_avatar(self, obj):
        request = self.context.get("request")
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return request.build_absolute_uri("/media/avatars/default.jpg")