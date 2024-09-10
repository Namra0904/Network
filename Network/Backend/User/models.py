from django.db import models
from django.utils import timezone
import uuid
from datetime import timedelta
# Create your models here.


class User(models.Model):
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True, blank=True)
    password = models.CharField(max_length=255)  # Corrected this line
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    bio = models.CharField(max_length=255,blank=True,null=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"User ID: {self.id} (username: {self.username})"
    

class Otp(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp')
    otp = models.CharField(max_length=6, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True) 

class PasswordResetRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reset_uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(default=timezone.now() + timedelta(minutes=15))  # Set expiration time to 15 minutes

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Password Reset Request for {self.user.email}"
    
    
class BlacklistedToken(models.Model):
    token = models.CharField(max_length=255, unique=True)
    added_at = models.DateTimeField(auto_now_add=True)