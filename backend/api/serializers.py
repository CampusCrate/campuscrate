from rest_framework import serializers
from .models import (
    University, User, Category, Listing, ListingImage, SavedListing, Notification
)

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name', 'slug']

class UserSerializer(serializers.ModelSerializer):
    university = UniversitySerializer(read_only=True)
    name = serializers.CharField(source='username', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'better_auth_id', 'is_verified_student', 'university', 'profile_picture', 'phone_number']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon_name']

class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image_url', 'is_primary']

class ListingSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'seller', 'category', 'title', 'description', 'price', 
            'condition', 'is_on_campus', 'meetup_location', 'status', 
            'views_count', 'images', 'created_at', 'updated_at'
        ]

class SavedListingSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)

    class Meta:
        model = SavedListing
        fields = ['id', 'listing', 'saved_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'action_url', 'created_at']
