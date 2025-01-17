from django.http import JsonResponse , HttpResponse
from .models import User , Otp , PasswordResetRequest , BlacklistedToken
from datetime import datetime, timedelta
from django.utils import timezone 
from django.core.mail import send_mail
from django.conf import settings
from Post.models import Post
from Follow.models import Follower
from django.template.loader import render_to_string
from Follow.models import Follower
import json
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


def register(request):    
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if User.objects.filter(email=email).exists() or User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Email or username is already registered."}, status=409)

        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()  
        
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
        # html_message = render_to_string('email_verification.html', {
        #     'first_name': user.firstname, 
        #     'otp': otp_value,
        #     'username': user.username,
        #     'project_name': 'My Network Project'
        # })
        
        message = f'Thank you for signing up for our app! Your Verification code is {otp_value} '
        from_email = settings.EMAIL_HOST_USER

        send_mail(subject, message, from_email, [email])

        return JsonResponse({"message": "User Verfication Mail sended.",'userId':user.id},status=201)

    return JsonResponse({'message':"Can't Register!"},status=405)


def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        login_credential = data.get('login')
        password = data.get('password')
        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()

        try:
            if '@' in login_credential:
                user = User.objects.get(email=login_credential, password=hashed_password)
               
            else:
                user = User.objects.get(username=login_credential, password=hashed_password)
                
            if user.is_verified:
                token = generate_jwt(user)
                namra , created=Follower.objects.get_or_create(user=user)
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


from django.core.exceptions import ValidationError

def update_user(request):
    if not request.user is not None:
        return JsonResponse({"error": "User is not authenticated"}, status=401)

    try:
        user = User.objects.get(id=request.user.id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)

    if request.method == 'POST':
        old_email = user.email
        
        # Get values from the request, fallback to existing values if not provided
        username = request.POST.get('username', user.username)
        firstname = request.POST.get('firstname', user.firstname)
        lastname = request.POST.get('lastname', user.lastname)
        dob = request.POST.get('dob', user.dob)
        # image = request.FILES.get('image', user.image)
        bio = request.POST.get('bio', user.bio)

        # Check if the new username already exists in the database (excluding the current user)
        if User.objects.filter(username=username).exclude(id=user.id).exists():
            return JsonResponse({'error': "Username already exists"}, status=400)

        # Validate and format the date of birth (dob)
        if dob:
            try:
              user.dob = dob
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Update user fields
        
        user.username = username
        user.email = old_email  # Keep the same email
        user.firstname = firstname
        user.lastname = lastname
        user.bio = bio

        # Update the image if provided
        if 'image' in request.FILES:
            user.image = request.FILES['image']

        # Save the updated user
        try:
            print(user.lastname)
            user.save()
            return JsonResponse({'message': "Data Updated", 'user': {
                'username': user.username,
                'firstname': user.firstname,
                'lastname': user.lastname,
                'dob': user.dob,
                'bio': user.bio,
                'image_url': user.image.url if user.image else None,
            }}, status=200)
        except ValidationError as e:
            return JsonResponse({'error': e.message_dict}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

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
        current = timezone.now()
        if current > expiration_time:
            return JsonResponse({'error':'Otp is expire now'},status=500)

        if entered_otp == otp_obj.otp:
            user.is_verified = True  
            namra , created=Follower.objects.get_or_create(user=user)
            user.save()
            token = generate_jwt(user)
            otp_obj.delete()  
            
            return JsonResponse({'Success':'Verification Done','token':token},status=201)
        else:
            return JsonResponse({'error':'Enter otp is not valid'},status=500) 

    return JsonResponse({"error": "Invalid request method."}, status=405)


def otp_resend_mail(request):
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
        return JsonResponse({'error': 'Authentication required'}, status=401)
    


def rest_password_mail(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get('email')
        user = User.objects.filter(email=email).first()

        if user:
            reset_request = PasswordResetRequest.objects.create(user=user)
            reset_link = f"http://127.0.0.1:5000/reset-password/{reset_request.reset_uuid}/"
            subject = 'Password Reset'
            message = f"Please click on the link to reset your password: {reset_link}"
            from_email = settings.EMAIL_HOST_USER

            send_mail(subject, message, from_email, [email])
            
            return JsonResponse({"success": "Password reset link sent!"}, status=200)
        else:
            return JsonResponse({"error": "Email does not exist!"}, status=404)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
    

def reset_password(request,uuid):
    if request.method == "POST":
        data = json.loads(request.body)
        password = data.get('password')
         
        reset_request = PasswordResetRequest.objects.get(reset_uuid=uuid, is_active=True)

        if reset_request.is_expired():
            return JsonResponse({"error": "Password reset link has expired."}, status=400)
        
        if hashlib.sha256(password.encode('utf-8')).hexdigest() == reset_request.user.password:
            return JsonResponse({"error": "Password is already use enter new password!"},status=400)
            
        try:
            reset_request.user.password = hashlib.sha256(password.encode('utf-8')).hexdigest()
            reset_request.user.save()
            reset_request.is_active = False
            reset_request.save()
            return JsonResponse({"success": "Password reset successful!"}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid user."}, status=404)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
    
    
def logout(request):
    if request.method == 'POST':
        print("Hi")
        token = request.headers.get('Authorization')
        print(token)
        if token:
            BlacklistedToken.objects.create(token=token)
        return JsonResponse({'success': 'Logged out successfully'},status=200)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)



def profile_data(request,username):
    if request.user is not None:
        if request.method == 'GET':
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
            posts = Post.objects.filter(creater=user)
            user_posts = []
            for post in posts:
                comments_data = []
                for comment in post.comments.all():
                    comments_data.append({
                        "profileImage": comment.commenter.image.url if comment.commenter.image else "",
                        "username": comment.commenter.username,
                        "text": comment.comment_content,
                    })
                liked_by_current_user = request.user in post.likers.all()
                saved_by_current_user = request.user in post.savers.all()
                user_posts.append({
                    "profileImage": post.creater.image.url if post.creater.image else "",
                    "username": post.creater.username,
                    'postId': post.id,
                    "date": post.date_created.strftime('%d-%m-%Y'),
                    "content": post.content_text,
                    "image": post.content_image.url if post.content_image else "",
                    "likes": post.likers.count(),
                    "liked_by_user": liked_by_current_user,
                    "saved_by_user": saved_by_current_user,
                    "comments": comments_data,
                    "userName":post.creater.firstname+" "+post.creater.lastname,
                    "is_owner": request.user == post.creater 
                })
 
            saved_posts = Post.objects.filter(savers=user)
            saved_posts_data = []
            for post in saved_posts:
                comments_data = []
                for comment in post.comments.all():
                    comments_data.append({
                        "profileImage": comment.commenter.image.url if comment.commenter.image else "",
                        "username": comment.commenter.username,
                        "text": comment.comment_content,
                    })
                liked_by_current_user = request.user in post.likers.all()
                saved_by_current_user = request.user in post.savers.all()
                saved_posts_data.append({
                    "profileImage": post.creater.image.url if post.creater.image else "",
                    'postId': post.id,
                    "date": post.date_created.strftime('%d-%m-%Y'),
                    "content": post.content_text,
                    "image": post.content_image.url if post.content_image else "",
                    "likes": post.likers.count(),
                    "liked_by_user": liked_by_current_user,
                    "saved_by_user": saved_by_current_user,
                    "comments": comments_data,
                    "userName":post.creater.firstname+" "+post.creater.lastname,
                    "is_owner": request.user == post.creater 
                })
            try:
                follower_count = Follower.objects.get(user=user).followers.count()
            except :
                follower_count = 0  # Users following the current user
            following_count = Follower.objects.filter(followers=user).count()
            is_following = Follower.objects.filter(followers=request.user).exists()
            print(is_following)
            profile_data = {
                "username": user.username,
                "profileImage": user.image.url if user.image else "",
                "posts": user_posts,
                'firstname':user.firstname,
                'lastname':user.lastname,
                'name':user.firstname+' '+user.lastname,
                'dob':  user.dob if user.dob else "",
                'bio': user.bio,
                'saved': saved_posts_data,
                'followers':follower_count,
                'following':following_count,
                'is_user':request.user == user,
                'is_following':is_following
            }
            return JsonResponse(profile_data, status=200)
        else:
            return JsonResponse({"error": "Invalid request method."}, status=405)
    else:
        return JsonResponse({'error': 'Authentication required'}, status=401)


def user_data(request):
    if request.user is not None:
        if request.method == "GET":
            user = request.user
            data = {
                "username": user.username,
                "firstname":user.firstname,
                "lastname":user.lastname,
                "profileImage":user.image.url if user.image else None
            }
            return JsonResponse(data,status=200)
        else:
            return JsonResponse({"error": "Invalid request method."}, status=405)
    else:
        return JsonResponse({'error': 'Authentication required'}, status=401)