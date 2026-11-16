
from django.urls import path

from .views import (
    SignupAPIView,
    LoginAPIView,
    CustomTokenRefreshView,
    UserProfileAPIView,
    UpdateProfileAPIView,
    ChangePasswordAPIView,
    ForgotPasswordAPIView,
    ResetPasswordAPIView,
    LogoutAPIView,
)

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginAPIView.as_view(), name='login'),

    path(
        'token/refresh/',
        CustomTokenRefreshView.as_view(),
        name='token_refresh'
    ),

    path('profile/', UserProfileAPIView.as_view(), name='profile'),

    path(
        'profile/update/',
        UpdateProfileAPIView.as_view(),
        name='update_profile'
    ),

    path(
        'change-password/',
        ChangePasswordAPIView.as_view(),
        name='change_password'
    ),

    path(
        'forgot-password/',
        ForgotPasswordAPIView.as_view(),
        name='forgot_password'
    ),

    path(
        'reset-password/',
        ResetPasswordAPIView.as_view(),
        name='reset_password'
    ),

    path('logout/', LogoutAPIView.as_view(), name='logout'),
]
