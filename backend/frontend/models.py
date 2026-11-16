
from django.db import models
from django.conf import settings


class UserProfile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    full_name = models.CharField(max_length=150)

    phone = models.CharField(
        max_length=15,
        unique=True
    )

    def __str__(self):
        return self.full_name
