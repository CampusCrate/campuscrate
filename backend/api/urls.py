from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UniversityViewSet, CategoryViewSet, ListingViewSet,
    SavedListingViewSet, NotificationViewSet
)

router = DefaultRouter()
router.register(r'universities', UniversityViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'listings', ListingViewSet, basename='listing')
router.register(r'saved', SavedListingViewSet, basename='saved')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]
