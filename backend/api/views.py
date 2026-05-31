from rest_framework import viewsets, permissions, filters
from .models import (
    University, Category, Listing, SavedListing, Notification
)
from .serializers import (
    UniversitySerializer, CategorySerializer, ListingSerializer,
    SavedListingSerializer, NotificationSerializer
)

class UniversityViewSet(viewsets.ModelViewSet):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all().order_by('-created_at')
    serializer_class = ListingSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'meetup_location']
    
    def perform_create(self, serializer):
        # Tie listing to the logged in user
        # user will be mapped from better_auth token later
        serializer.save()

class SavedListingViewSet(viewsets.ModelViewSet):
    serializer_class = SavedListingSerializer

    def get_queryset(self):
        # We will filter by the logged in user via better_auth mappings later
        return SavedListing.objects.all()

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.all().order_by('-created_at')
