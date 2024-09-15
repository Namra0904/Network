from django.shortcuts import render , HttpResponse 
from django.http import JsonResponse
from User.models import User
from .models import Follower
import json

def follow(request, username):
    if request.user is None:
        return JsonResponse({'error':'Authentication required'})
    if request.method == 'PUT':
        try:
            user = User.objects.get(username=username)
            follower = Follower.objects.filter(user=user).first()

            if not follower:
                follower = Follower(user=user)
                follower.save()

            if request.user in follower.followers.all():
                return JsonResponse({"error": "You are already following this user."}, status=400)

            follower.followers.add(request.user)
            follower.save()

            return JsonResponse({"success": "Followed successfully."}, status=200)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


def unfollow(request, username):
    if  request.user is None:
        return JsonResponse({'error':'Authentication required'})
    
    if request.method == 'PUT':
        try:
            user = User.objects.get(username=username)
            follower = Follower.objects.filter(user=user).first()

            if not follower:
                return JsonResponse({"error": "This user has no followers."}, status=400)

            if request.user not in follower.followers.all():
                return JsonResponse({"error": "You are not following this user."}, status=400)

            follower.followers.remove(request.user)
            follower.save()

            return JsonResponse({"message": "Unfollowed successfully."}, status=200)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
    

def search_users(request):
    if request.user is not None:
        if request.method == "POST":
            search = request.POST.get('search', '')
            user = request.user
            data = []

            if search:
                all_users = User.objects.filter(username__icontains=search).exclude(id=user.id)
                for user_obj in all_users:
                    is_followed = user_obj in user.following.all()
                    data.append({
                        'id': user_obj.id,
                        'username': user_obj.username,
                        'firstname': user_obj.firstname,
                        'lastname': user_obj.lastname,
                        'image': user_obj.image.url if user_obj.image else '',
                        'isFollowed': is_followed
                    })
            else:
                followed_users = user.following.all()
                not_followed_users = User.objects.exclude(id__in=followed_users).exclude(id=user.id)
                for user_obj in not_followed_users:
                    is_followed = user_obj in followed_users
                    data.append({
                        'id': user_obj.id,
                        'username': user_obj.username,
                        'firstname': user_obj.firstname,
                        'lastname': user_obj.lastname,
                        'image': user_obj.image.url if user_obj.image else '',
                        'isFollowed': is_followed
                    })
            return JsonResponse({'users': data}, status=200)
        else:
            return JsonResponse({"error": "Invalid request method"}, status=405)
    else:
        return JsonResponse({'error': 'Authentication required'}, status=401)