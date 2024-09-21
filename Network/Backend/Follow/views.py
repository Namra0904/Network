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
            follower = Follower.objects.get(user=user)
            print("user_name",username)
            print("follower ",follower)
            if not follower:
                return JsonResponse({"error": "This user has no followers."}, status=400)
            # print(request.user)
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
            data =json.loads(request.body)
            search = data.get('search')
            # print(search)
            user = request.user
            data = []

            if search:
                all_users = User.objects.filter(username__icontains=search).exclude(id=user.id)
                
                following_instance = Follower.objects.get(user=user)

                # Access the followers (ManyToManyField)
                followers_list = following_instance.followers.all()
                # print("khush",user.followers.all())
                for user_obj in all_users:
                    print( user_obj)
                    is_followed = user_obj in followers_list
                    data.append({
                        'id': user_obj.id,
                        'username': user_obj.username,
                        'firstname': user_obj.firstname,
                        'lastname': user_obj.lastname,
                        'image': user_obj.image.url if user_obj.image else '',
                        'isFollowed': is_followed
                    })
            else:
                followers_data = Follower.objects.exclude(user=user)
                print("data",followers_data)
                for follower_instance in followers_data:
                      # The user for this instance
                    followers = follower_instance.followers.all()
                    is_followed = user in followers
                    data.append({
                        'id': follower_instance.user.id,
                        'username': follower_instance.user.username,
                        'firstname': follower_instance.user.firstname,
                        'lastname':follower_instance.user.lastname,
                        'image': follower_instance.user.image.url if follower_instance.user.image else '',
                        'isFollowed':is_followed
                    }) 
                        



                # followed_users = user.following.all()
                # # print(followed_users)
                # not_followed_users = User.objects.exclude(id__in=followed_users).exclude(id=user.id)
                # following_instance = Follower.objects.get(user=user)

                # # Access the followers (ManyToManyField)
                # followers_list = following_instance.followers.all()
                # for user_obj in not_followed_users:
                #     is_followed = user_obj in followers_list
                #     data.append({
                #         'id': user_obj.id,
                #         'username': user_obj.username,
                #         'firstname': user_obj.firstname,
                #         'lastname': user_obj.lastname,
                #         'image': user_obj.image.url if user_obj.image else '',
                #         'isFollowed': is_followed
                #     })
            print(data)
            return JsonResponse({'users': data}, status=200)
        else:
            return JsonResponse({"error": "Invalid request method"}, status=405)
    else:
        return JsonResponse({'error': 'Authentication required'}, status=401)