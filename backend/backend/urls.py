from django.contrib import admin
from django.urls import path, include
from nba_stats import views
from rest_framework import routers

router = routers.DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/nba-teams/', views.nba_teams, name='nba_teams'),
    path('api/team/<int:team_id>/', views.get_team_data, name='get_team_data'),
    path('api/team/<str:team_name>/player/<int:player_id>/', views.get_player_data, name='get_player_data'),
]
