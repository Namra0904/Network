from django.shortcuts import render
from .models import Post
from User.models import User
from django.http import JsonResponse

def create_post(request):
    if request.method == 'POST':
        try:
            text = request.POST.get('text')
            image = request.FILES.get('image')

            if isinstance(request.user, User):
                post = Post.objects.create(creater=request.user, content_text=text,content_image=image)
                return JsonResponse({"message": "Post created successfully.", "post_id": post.id},status=201)
            else:
                return JsonResponse({"error": "Invalid user."}, status=400)

        except ValueError as e:
            return JsonResponse({"error": str(e)}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request method."}, status=405)


def update_post(request, id):
    if request.user is None:
        return JsonResponse({'error': 'Authentication required'}, status=401)

    try:
        post = Post.objects.get(id=id)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)

    if post.creater != request.user:
        return JsonResponse({'error': 'You do not have permission to update this post'}, status=403)

    if request.method == 'POST':
        content_text = request.POST.get('text')
        post.content_text = content_text
        
        post.save()
        
        return JsonResponse({'success': 'Post updated successfully'}, status=200)
    
    return JsonResponse({'error': "Invalid request method"}, status=405)


def delete_post(request, id):
    if request.user is None:
        return JsonResponse({'error': 'Authentication required'}, status=401)

    if request.method == 'DELETE':
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)

        if request.user == post.creater:
            try:
                post.delete()
                return JsonResponse({'success': 'Post deleted successfully'}, status=200)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return JsonResponse({'error': 'You do not have permission to delete this post'}, status=403)

    return JsonResponse({'error': "Method must be 'DELETE'"}, status=405)


def save_post(request, id):
    if request.user is None:
        return JsonResponse({'error': 'Authentication required'}, status=401)

    if request.method == 'PUT':
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)

        try:
            post.savers.add(request.user)
            post.save()
            return JsonResponse({'success': 'Post saved successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': "Method must be 'PUT'"}, status=405)


def unsave_post(request, id):
    if request.user is None:
        return JsonResponse({'error': 'Authentication required'}, status=401)

    if request.method == 'PUT':
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)

        try:
            post.savers.remove(request.user)
            post.save()
            return JsonResponse({'success': 'Post unsaved successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': "Method must be 'PUT'"}, status=405)


def like_post(request, id):
    if request.user is None:
        return JsonResponse({'error': 'Authentication required'}, status=401)

    if request.method == 'PUT':
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)

        try:
            post.likers.add(request.user)
            post.save()
            return JsonResponse({'success': 'Post liked successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': "Method must be 'PUT'"}, status=405)


def unlike_post(request, id):
    if request.user is None:
        return JsonResponse({'error': 'Authentication required'}, status=401)

    if request.method == 'PUT':
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)

        try:
            post.likers.remove(request.user)
            post.save()
            return JsonResponse({'success': 'Post unliked successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': "Method must be 'PUT'"}, status=405)


def allPost(request):
    if request.user is not None:
        if request.method == 'GET':
            posts = Post.objects.all().order_by('-date_created')  # Corrected line
            response_data = []

            for post in posts:
                comments_data = []
                for comment in post.comments.all():
                    comments_data.append({
                        "profileImage": comment.commenter.image.url if comment.commenter.image else "",
                        "username": comment.commenter.username,
                        "text": comment.comment_content,
                    })
                liked_by_current_user = request.user in post.likers.all()
                post_data = {
                    "profileImage": post.creater.image.url if post.creater.image else "",
                    "username": post.creater.username,
                    "date": post.date_created.strftime('%Y-%m-%d'),
                    "content": post.content_text,
                    "image": post.content_image.url if post.content_image else "",
                    "likes": post.likers.count(),
                    "postId":post.id,
                    "userId":post.creater.id,
                    "comments": comments_data,
                    "liked_by_current_user":liked_by_current_user
                }
                response_data.append(post_data)
            
            return JsonResponse(response_data, safe=False, status=201)
        else:
            return JsonResponse({'error': 'Invalid Method'}, status=405)
    else:
        return JsonResponse({'error': 'Authentication required'}, status=401)