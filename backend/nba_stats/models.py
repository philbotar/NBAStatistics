
from django.db import models
 
class Todo(models.Model):
    title=models.CharField(max_length=150)
    description=models.CharField(max_length=500)
    completed=models.BooleanField(default=False)
 
    def __str__(self):
        return self.title

class StatsCovered(models.Model):
    PPG = models.IntegerField(default=0)
    APG = models.IntegerField(default=0)
    RPG = models.IntegerField(default=0)
    ThreePM = models.IntegerField(default=0)


    def __str__(self):
        return self.name