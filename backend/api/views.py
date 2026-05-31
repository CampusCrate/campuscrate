from rest_framework import viewsets, permissions, filters, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import (
    University, Category, Listing, SavedListing, Notification, User
)
from .serializers import (
    UniversitySerializer, CategorySerializer, ListingSerializer,
    SavedListingSerializer, NotificationSerializer, RegisterSerializer, UserSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

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
        serializer.save(seller=self.request.user)

class SavedListingViewSet(viewsets.ModelViewSet):
    serializer_class = SavedListingSerializer

    def get_queryset(self):
        # Filter by the logged in user
        if self.request.user.is_authenticated:
            return SavedListing.objects.filter(user=self.request.user)
        return SavedListing.objects.none()

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.all().order_by('-created_at')
