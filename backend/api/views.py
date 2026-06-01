import uuid
from supabase import create_client
from django.conf import settings
from django.http import JsonResponse
from rest_framework import viewsets, permissions, filters, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .models import (
    University, Category, Listing, SavedListing, Notification, User
)
from .serializers import (
    UniversitySerializer, CategorySerializer, ListingSerializer,
    SavedListingSerializer, NotificationSerializer, RegisterSerializer, UserSerializer
)

@api_view(['GET'])
@permission_classes([])
def health_check(request):
    """Simple health check endpoint for Docker/load balancer liveness probes."""
    return JsonResponse({"status": "ok"})


class SupabaseUploadURLView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file_name = request.data.get('file_name', '')
        file_type = request.data.get('file_type', 'image/jpeg')

        if not file_name:
            return Response({'error': 'file_name is required'}, status=status.HTTP_400_BAD_REQUEST)


        ext = file_name.rsplit('.', 1)[-1] if '.' in file_name else 'jpg'
        path = f"listings/{uuid.uuid4()}.{ext}"

        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

        result = supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).create_signed_upload_url(path)

        signed_url = result.get('signedURL') or result.get('signed_url', '')
        token      = result.get('token', '')

        # Public URL format for Supabase Storage
        public_url = (
            f"{settings.SUPABASE_URL}/storage/v1/object/public"
            f"/{settings.SUPABASE_STORAGE_BUCKET}/{path}"
        )

        return Response({
            'upload_url': signed_url,
            'token': token,
            'public_url': public_url,
            'path': path,
        })

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

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
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
    
    def get_queryset(self):
        qs = super().get_queryset()
        seller_id = self.request.query_params.get('seller')
        if seller_id:
            qs = qs.filter(seller_id=seller_id)
        return qs
        
    def create(self, request, *args, **kwargs):
        category_slug = request.data.get('category_slug')
        category = None
        if category_slug:
            # Create the category automatically if it is missing
            from .models import Category
            category, created = Category.objects.get_or_create(
                slug=category_slug,
                defaults={'name': category_slug.replace('-', ' ').title(), 'icon_name': 'tag'}
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save with user and category
        instance = serializer.save(seller=request.user, category=category)
        
        # Create images
        from .models import ListingImage
        image_urls = request.data.get('image_urls', [])
        is_primary = True
        for url in image_urls:
            ListingImage.objects.create(listing=instance, image_url=url, is_primary=is_primary)
            is_primary = False
            
        headers = self.get_success_headers(serializer.data)
        
        # Retrieve fresh data to include images
        fresh_data = self.get_serializer(instance).data
        return Response(fresh_data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
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
