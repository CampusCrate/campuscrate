from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            # We treat the 'username' argument as an email
            user = UserModel.objects.get(email__iexact=username)
        except UserModel.DoesNotExist:
            return None
        
        if user.check_password(password):
            return user
        return None
