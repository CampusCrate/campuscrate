from django.contrib import admin
from .models import (
    University, User, VerificationRequest, Category, 
    Listing, ListingImage, SavedListing, Notification
)

admin.site.register(University)
admin.site.register(User)
admin.site.register(VerificationRequest)
admin.site.register(Category)
admin.site.register(Listing)
admin.site.register(ListingImage)
admin.site.register(SavedListing)
admin.site.register(Notification)
