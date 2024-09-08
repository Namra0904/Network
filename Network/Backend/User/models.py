from django.db import models
from django.utils import timezone
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