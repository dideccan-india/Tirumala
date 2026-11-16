from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import (
    SignupSerializer,
    LoginSerializer,
    ProfileSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)



class SignupAPIView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.save()

            return Response({
                "status": True,
                "success": True,
                "message": "Signup successful.",
                "data": {
                    "id": user.id,
                    "full_name": user.profile.full_name,
                    "email": user.email,
                    "phone": user.profile.phone
                }
            }, status=status.HTTP_201_CREATED)

        return Response({
            "status": False,
            "success": False,
            "message": "Signup failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    # 1. LOGIN API
class LoginAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                "status": False,
                "message": "Login failed.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        return Response({
            "status": True,
            "message": "Login successful.",
            "data": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "full_name": user.profile.full_name,
                    "email": user.email,
                    "phone": user.profile.phone
                }
            }
        }, status=status.HTTP_200_OK)


# 2. REFRESH TOKEN API
class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]
    authentication_classes = []


# 3. USER PROFILE API
class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "status": True,
            "message": "Profile fetched successfully.",
            "data": {
                "id": user.id,
                "full_name": user.profile.full_name,
                "email": user.email,
                "phone": user.profile.phone
            }
        })


# 4. UPDATE PROFILE API
class UpdateProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            user = serializer.save()

            return Response({
                "status": True,
                "message": "Profile updated successfully.",
                "data": {
                    "id": user.id,
                    "full_name": user.profile.full_name,
                    "email": user.email,
                    "phone": user.profile.phone
                }
            })

        return Response({
            "status": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# 5. CHANGE PASSWORD API
class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            request.user.set_password(
                serializer.validated_data['new_password']
            )
            request.user.save()

            return Response({
                "status": True,
                "message": "Password changed successfully."
            })

        return Response({
            "status": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# 6. FORGOT PASSWORD API
class ForgotPasswordAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        user = User.objects.filter(
            email__iexact=email,
            is_active=True
        ).first()

        # Same response whether email exists or not.
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            reset_link = (
                f"http://localhost:5173/reset-password/"
                f"?uid={uid}&token={token}"
            )

            send_mail(
                subject="Password Reset",
                message=(
                    f"Use this link to reset your password:\n"
                    f"{reset_link}\n\n"
                    "If you did not request this, ignore this email."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

        return Response({
            "status": True,
            "message": (
                "If the account exists, password reset instructions "
                "have been sent."
            )
        })


# 7. RESET PASSWORD API
class ResetPasswordAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            user.set_password(
                serializer.validated_data['new_password']
            )
            user.save()

            return Response({
                "status": True,
                "message": "Password reset successfully."
            })

        return Response({
            "status": False,
            "message": "Password reset failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# 8. LOGOUT API
class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({
                "status": False,
                "message": "Refresh token is required."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({
                "status": True,
                "message": "Logout successful."
            })

        except Exception:
            return Response({
                "status": False,
                "message": "Invalid or expired refresh token."
            }, status=status.HTTP_400_BAD_REQUEST)
