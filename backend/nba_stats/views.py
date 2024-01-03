from .serializers import *
from .models import *
from django.http import JsonResponse, HttpResponse
from nba_api.stats.static import teams, players
from rest_framework.decorators import api_view
from nba_api.stats.endpoints import commonteamroster, leaguegamefinder, playergamelog, commonplayerinfo
from django.views.decorators.csrf import csrf_exempt
import pandas as pd


wYEAR = '2022-23'

def get_team_data(request, team_id):
    print('team_id', team_id)
    team = teams.find_team_name_by_id(team_id)
    if not team:
        return JsonResponse({"error": "Team not found"}, status=404)

    game_log = get_game_log(team_id, False)
    game_log_data = game_log.to_dict(orient='records')

    roster = get_team_roster(team_id)


    # Build the response object
    curTeam = {
        'team': team,
        'roster': roster,
        'game_log': game_log_data
    }

    return JsonResponse(curTeam, safe=False)

def get_common_player_info(player_id):
    if not player_id:
        return JsonResponse({"error": "Player not found"}, status=404)

    # Fetch the player info
    player_info = commonplayerinfo.CommonPlayerInfo(player_id=player_id)
    player_info = player_info.get_dict()
    player_info = player_info.get('resultSets')[0].get('rowSet')[0]

    return player_info

def get_player_data(request, player_id, team_name):
    if request.method == 'GET':
        last_10_games = get_players_games(player_id)
        player_name = players.find_player_by_id(player_id)
        print(get_common_player_info(player_id))
        player = {
            'name': player_name,
            'team': team_name,
            'last_10_games': last_10_games.to_dict(orient='records'),
            'info': get_common_player_info(player_id)
        }

        return JsonResponse(player, safe=False)

def get_team_roster(team_id):
    if not team_id:
        return JsonResponse({"error": "Team not found"}, status=404)

    # Fetch the team roster
    roster_data = commonteamroster.CommonTeamRoster(team_id=team_id, season='2022-23')
    roster = roster_data.get_dict()
    roster =  [roster.get('resultSets')[0].get('rowSet')[i] for i in range(len(roster.get('resultSets')[0].get('rowSet')))]
    return roster



def get_game_log(TEAM_ID, short):
    # Fetch all games for the specified season and filter by the team ID
    gamefinder = leaguegamefinder.LeagueGameFinder(season_nullable='2022-23', season_type_nullable='Regular Season')
    all_games = gamefinder.get_data_frames()[0]
    team_games = all_games[all_games['TEAM_ID'] == TEAM_ID]
    
    if short:
        team_games = team_games.head(10)

    # Get the opponent scores using plus-minus, setting to minus if the team lost
    for index, row in team_games.iterrows():
        if row['WL'] == 'W':
            team_games.at[index, 'OPP_SCORE'] = row['PLUS_MINUS'] * -1 + row['PTS']
        else:
            team_games.at[index, 'OPP_SCORE'] = row['PLUS_MINUS'] + row['PTS']

    # Select relevant columns
    game_log = team_games
    
    return game_log

def get_players_games(player_id):
    game_log = playergamelog.PlayerGameLog(player_id=player_id, season=YEAR, season_type_all_star='Regular Season')
    game_log_df = game_log.get_data_frames()[0]

    return game_log_df

def get_team_name(team_id):
    return teams.find_team_name_by_id(team_id)['full_name']

def nba_teams(request):
    nba_teams_data = teams.get_teams()
    return JsonResponse(nba_teams_data, safe=False)
 
