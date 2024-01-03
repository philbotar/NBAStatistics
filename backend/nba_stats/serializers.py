
# import serializers from the REST framework
from rest_framework import serializers
 
# import the todo data model
from .models import *
 


class StatsCovered(serializers.ModelSerializer):
    class Meta:
        model = StatsCovered
        fields = ('PPG', 'APG', 'RPG', 'ThreePM')