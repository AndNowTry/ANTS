from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import History


class HistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = History
        fields = '__all__'

