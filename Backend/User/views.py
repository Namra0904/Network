from django.http import JsonResponse , HttpResponse
from .models import User , Otp
from django.core.mail import send_mail
from django.conf import settings
import time
import json
from datetime import datetime, timedelta
from django.utils import timezone 
import random
import hashlib
import jwt
import pytz

def generate_otp():
    otp = random.randint(100000, 999999)
    return str(otp)

def generate_jwt(user):
    utc_now = datetime.now(pytz.utc) 
    payload = {
        'id': user.id,
        'username': user.username,
        'exp': utc_now + timedelta(hours=24),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token



def home(request):
    return JsonResponse({'message':'home page'})

def register(request):    
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        # if password != password_confirmation:    
        #     return JsonResponse({"error": "Passwords do not match."},status=400)
        
        if User.objects.filter(email=email).exists() or User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Email or username is already registered."}, status=409)

        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()  # to encode the password 
        
        user = User(
            username=username,
            email=email,
            password=hashed_password,
            firstname=data.get('firstname'),
            lastname=data.get('lastname'),
            
        )
        user.save()
        otp_value = generate_otp()
        otp_obj = Otp.objects.create(user=user, otp=otp_value)
        subject = 'Welcome to My App'
        message = f'Thank you for signing up for our app! Your Verification code is {otp_value} '
        from_email = settings.EMAIL_HOST_USER

        send_mail(subject, message, from_email, [email])

        return JsonResponse({"message": "User Verfication Mail sended.",'userId':user.id},status=201)

    return JsonResponse({'message':"Can't Register!"},status=405)


# method for user login
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        login_credential = data.get('login')
        password = data.get('password')
        # login_credential = request.POST.get('login')
        # password = request.POST.get('password')
        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()

        try:
            if '@' in login_credential:
                user = User.objects.get(email=login_credential, password=hashed_password)
               
            else:
                user = User.objects.get(username=login_credential, password=hashed_password)
                
            if user.is_verified:
                token = generate_jwt(user)
                return JsonResponse({"message": "Login successful.", "token": token})
            else:
                if Otp.objects.filter(user=user).exists():
                    Otp.objects.filter(user=user).delete()
                otp_value = generate_otp()
                otp_obj = Otp.objects.create(user=user, otp=otp_value)
                subject = 'Verfication'
                message = f'Your Verification code is {otp_value} '
                from_email = settings.EMAIL_HOST_USER
                send_mail(subject, message, from_email, [user.email])
                return JsonResponse({"error": "Unverified"}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid credentials."},status=401)

    return JsonResponse({'message':"Can't Login!"},status=500)


def update_user(request):

    if request.user is not None:
        user = User.objects.get(id=request.user.id)
        if user:
            if request.method == 'POST':

                # old_username = user.username
                old_email = user.email

                username = request.POST.get('username', user.username)
                firstname = request.POST.get('firstname', user.firstname)
                lastname = request.POST.get('lastname', user.lastname)
                dob = request.POST.get('dob', user.dob)
                
            # Update user fields only if new data is provided
                user.username = username
                user.email = old_email
                user.firstname = firstname
                user.lastname = lastname
                user.dob = dob
                
                # Update profile image if provided
                # if 'image' in request.FILES:
                #     user.image = request.FILES['image']
                
                user.save()
                # return redirect('profile')  # Redirect to profile page after updating
                return JsonResponse({'Message':"Data Updated"})
        
        return JsonResponse({'message':"Can't Update"})
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


def verify_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            id = data.get('id')
            user = User.objects.get(id=id)
            otp_obj = Otp.objects.get(user=user)
        except User.DoesNotExist:
            return HttpResponse("User not found.", status=404)
        except Otp.DoesNotExist:
            return HttpResponse("OTP not found for this user.", status=404)
    
        entered_otp = data.get('otp')
        expiration_time = otp_obj.created_at + timedelta(minutes=3)
        print(expiration_time)
        current = timezone.now()
        print(current)
        if current > expiration_time:
            return JsonResponse({'error':'Otp is expire now'},status=500)

        if entered_otp == otp_obj.otp:
            user.is_verified = True  
            user.save()
            token = generate_jwt(user)
            otp_obj.delete()  
            
            return JsonResponse({'Success':'Verification Done','token':token},status=201)
        else:
            return JsonResponse({'error':'Enter otp is not valid'},status=500) 

    return JsonResponse({"error": "Invalid request method."}, status=405)


def resend_mail(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            id = data.get('id')
            user = User.objects.get(id=id)
            otp_value = generate_otp()
            otp_obj = Otp.objects.get(user=user)
            otp_obj.otp = otp_value
            otp_obj.save()
            subject = 'Email Verification'
            message = f'Your Verification code is {otp_value}'
            from_email = settings.EMAIL_HOST_USER

            send_mail(subject, message, from_email, [user.email])

            return JsonResponse({'Success':"Mail is sended"},status=201)
        except User.DoesNotExist:
            return HttpResponse("User not found.", status=404)
        except Otp.DoesNotExist:
            return HttpResponse("OTP not found for this user.", status=404)
        
    return JsonResponse({"error": "Invalid request method."}, status=405)

           
def change_password(request):
    if request.user is not None:
        if request.method == "POST":
            user = User.objects.get(id=request.user.id)
            old_password = request.POST.get('old_password')
            new_password = request.POST.get('new_password')
            confirm_password = request.POST.get('confirm_password')
            old_hash_password = hashlib.sha256(old_password.encode('utf-8')).hexdigest()
            if old_hash_password == user.password:
                if new_password == confirm_password:
                    hash_password = hashlib.sha256(new_password.encode('utf-8')).hexdigest()
                    user.password = hash_password
                    user.save()
                    return JsonResponse({'message':"Password Changed"})
                else:
                    return JsonResponse({'message':" New Password and confirmation password doesn't match"})
            else:
                return JsonResponse({'message':"Current password is incorrect"})
        else:
            return JsonResponse({"error": "Invalid request method."}, status=405)
    else:
        return JsonResponse({"message": "Does not authenticated!"}, status=405)
    
  
    
def generate_jwt_token(user):
    payload = {
        'user_id': user.id,
        'email': user.email,
        'exp': time.time() + 15 * 60,  # Token expires in 15 minutes
        'iat': time.time(),  # Issued at
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

def reset_send_mail(request):
    if request.method == "POST":
        email = request.POST.get('email')
        user = User.objects.filter(email=email).first()

        if user:
            token = generate_jwt_token(user)
            print(token)
            reset_link = f"http://127.0.0.1:8000/reset-password/{token}/"
            subject = 'Password Reset'
            message = f"Please click on the link to reset your password: {reset_link}"
            from_email = settings.EMAIL_HOST_USER

            send_mail(subject, message, from_email, [email])

            return JsonResponse({"success": "Password reset link sent!"}, status=200)
        else:
            return JsonResponse({"error": "Email does not exist!"}, status=404)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
    

def reset_password(request,token):
    if request.method == "POST":
        password = request.POST.get('password')
        password_confirmation = request.POST.get('password_confirmation')

        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        if not payload:
            return JsonResponse({"error": "Invalid or expired token."}, status=400)
        
        user_id = payload['user_id']
        
        if hashlib.sha256(password.encode('utf-8')).hexdigest() == User.objects.get(id=user_id).password:
            return JsonResponse({"error": "Password cannot be the same as the current password!"},status=400)
            
        if password != password_confirmation:
            return JsonResponse({"error": "Passwords do not match!"}, status=400)
        try:
            user = User.objects.get(id=user_id)
            user.password = hashlib.sha256(password.encode('utf-8')).hexdigest()
            user.save()
            return JsonResponse({"success": "Password reset successful!"}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user."}, status=404)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)