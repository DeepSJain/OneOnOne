from django.db import models

class Contact(models.Model):
    name = models.CharField(max_length=50, blank=False)
    email = models.EmailField(blank=False)
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='contacts')