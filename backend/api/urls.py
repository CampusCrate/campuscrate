from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    UniversityViewSet, CategoryViewSet, ListingViewSet,
    SavedListingViewSet, NotificationViewSet, RegisterView, CurrentUserView,
    SupabaseUploadURLView, health_check,
)

router = DefaultRouter()
router.register(r'universities', UniversityViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'listings', ListingViewSet, basename='listing')
router.register(r'saved', SavedListingViewSet, basename='saved')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/me/', CurrentUserView.as_view(), name='auth_me'),
    path('listings/upload-url/', SupabaseUploadURLView.as_view(), name='supabase_upload_url'),
    path('health/', health_check, name='health_check'),
    path('', include(router.urls)),
]
