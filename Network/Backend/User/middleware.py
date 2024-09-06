import jwt
from django.conf import settings
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from .models import User
import re
import logging

logger = logging.getLogger(__name__)

class TokenAuthenticationMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response
        self.exempt_paths = [
            r'^/register/$',
            r'^/login/$',
            r'^/user/verify/$',
            r'^/user/resend_mail/$',
            r'^/reset_send_mail/$',
            r'^/reset_password/[a-zA-Z0-9_\-\.]+/?$',
            r'^/media/.*$'  # Exempt all paths under /media/
        ]

    def _is_exempt_path(self, path):
        # Check if the request path matches any of the exempt paths
        for exempt_path in self.exempt_paths:
            if re.match(exempt_path, path):
                logger.info(f"Path exempted: {path}")
                return True
        logger.info(f"Path not exempted: {path}")
        return False

    def __call__(self, request):
        logger.info(f"Request path: {request.path}")

        # Skip authentication check for admin URLs or exempt paths
        if request.method == 'OPTIONS':
            return self.get_response(request)

        if request.path.startswith('/admin') or self._is_exempt_path(request.path):
            return self.get_response(request)
        
        # Retrieve token from the Authorization header
        token = request.headers.get('Authorization')
        if not token:
            return JsonResponse({'error': 'Token missing'}, status=401)

        try:
            # Decode the token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

            # Fetch the user based on the ID in the token payload
            user = User.objects.get(id=payload['id'])
            request.user = user  # Set the user in the request for later use

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token expired'}, status=401)

        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=401)

        # If everything is fine, proceed to the view
        return self.get_response(request)