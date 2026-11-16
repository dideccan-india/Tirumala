
from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from .models import UserProfile
import re


class SignupSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already registered.")

        return value

    def validate_phone(self, value):
        value = value.strip()

        if not re.fullmatch(r'\+?[0-9]{10,15}', value):
            raise serializers.ValidationError("Enter a valid phone number.")

        if UserProfile.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already registered.")

        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('confirm_password')

        password = validated_data.pop('password')
        full_name = validated_data.pop('full_name')
        email = validated_data.pop('email')
        phone = validated_data.pop('phone')

        user = User.objects.create_user(
            username=phone,
            email=email,
            first_name=full_name,
            password=password
        )

        UserProfile.objects.create(
            user=user,
            full_name=full_name,
            phone=phone
        )

        return user


# LOGIN SERIALIZER
class LoginSerializer(serializers.Serializer):
    email_or_phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        login_value = attrs['email_or_phone'].strip()
        password = attrs['password']

        if '@' in login_value:
            user = User.objects.filter(
                email__iexact=login_value
            ).first()

            username = user.username if user else None
        else:
            profile = UserProfile.objects.filter(
                phone=login_value
            ).select_related('user').first()

            username = profile.user.username if profile else None

        if not username:
            raise serializers.ValidationError({
                "message": "Invalid email/phone or password."
            })

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            raise serializers.ValidationError({
                "message": "Invalid email/phone or password."
            })

        if not user.is_active:
            raise serializers.ValidationError({
                "message": "Your account is inactive."
            })

        attrs['user'] = user
        return attrs


# PROFILE SERIALIZER
class ProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='profile.full_name', required=False)
    phone = serializers.CharField(source='profile.phone', required=False)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone']
        read_only_fields = ['id', 'email']

    def validate_phone(self, value):
        user = self.instance

        if UserProfile.objects.filter(phone=value).exclude(user=user).exists():
            raise serializers.ValidationError(
                "Phone number already registered."
            )

        if not re.fullmatch(r'\+?[0-9]{10,15}', value):
            raise serializers.ValidationError("Enter a valid phone number.")

        return value

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})

        profile = instance.profile

        if 'full_name' in profile_data:
            instance.first_name = profile_data['full_name']
            profile.full_name = profile_data['full_name']

        if 'phone' in profile_data:
            profile.phone = profile_data['phone']
            instance.username = profile_data['phone']

        instance.save()
        profile.save()

        return instance


# CHANGE PASSWORD SERIALIZER
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context['request'].user

        if not user.check_password(attrs['old_password']):
            raise serializers.ValidationError({
                'old_password': 'Old password is incorrect.'
            })

        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match.'
            })

        try:
            validate_password(attrs['new_password'], user=user)
        except DjangoValidationError as error:
            raise serializers.ValidationError({
                'new_password': error.messages
            })

        return attrs


# FORGOT PASSWORD SERIALIZER
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


# RESET PASSWORD SERIALIZER
class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match.'
            })

        try:
            user_id = force_str(
                urlsafe_base64_decode(attrs['uid'])
            )
            user = User.objects.get(pk=user_id)

        except (ValueError, TypeError, User.DoesNotExist):
            raise serializers.ValidationError({
                'token': 'Invalid password reset link.'
            })

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({
                'token': 'Invalid or expired password reset link.'
            })

        try:
            validate_password(attrs['new_password'], user=user)
        except DjangoValidationError as error:
            raise serializers.ValidationError({
                'new_password': error.messages
            })

        attrs['user'] = user
        return attrs
