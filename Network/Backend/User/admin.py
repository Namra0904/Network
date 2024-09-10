from django.contrib import admin
from .models import User , Otp , PasswordResetRequest , BlacklistedToken
# Register your models here.
admin.site.register(User)
admin.site.register(Otp)
admin.site.register(PasswordResetRequest)
admin.site.register(BlacklistedToken)
