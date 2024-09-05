from django.shortcuts import render
from .models import Comment
from Post.models import Post
from django.http import JsonResponse
from django.db import IntegrityError
import json

def comment(request, id):
    if request.user is not None:
        if request.method == 'POST':
            data = json.loads(request.body)
            comment_text = data.get('comment_text')
            print(comment_text)
            if not comment_text:
                return JsonResponse({'error': 'Comment text is required.'}, status=400)

            try:
                post = Post.objects.get(id=id)
            except Post.DoesNotExist:
                return JsonResponse({'error': 'Post not found.'}, status=404)
            
            try:
                new_comment = Comment.objects.create(
                    post=post,
                    commenter=request.user,
                    comment_content=comment_text
                )
                post.comment_count += 1
                post.save()

                return JsonResponse({'success': 'Comment added successfully.'}, status=201)

            except IntegrityError as e:
                return JsonResponse({'error': 'Integrity error occurred: {}'.format(str(e))}, status=400)
            except Exception as e:
                return JsonResponse({'error': 'An unexpected error occurred: {}'.format(str(e))}, status=500)

        else:
            return JsonResponse({'error': 'Invalid request method.'}, status=405)
    
    return JsonResponse({'error': 'Authentication required.'}, status=401)
