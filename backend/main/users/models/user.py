from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    theme = models.CharField(default="dark", max_length=20)
    font_size = models.CharField(default="small", max_length=20)
    pfp = models.ImageField(upload_to="image_dir", default="image_dir/default.png")