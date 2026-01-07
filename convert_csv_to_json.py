import csv
import json
import os

csv_file_path = '/home/ubuntu/upload/board_games_20251227_091731.csv'
json_file_path = '/home/ubuntu/boardgame-search/client/src/lib/games-data.json'

games = []
with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # JSON 문자열로 되어 있는 필드들을 파싱
        try:
            row['genres'] = json.loads(row['genres'])
        except:
            row['genres'] = []
            
        try:
            row['mechanics'] = json.loads(row['mechanics'])
        except:
            row['mechanics'] = []
            
        try:
            row['themes'] = json.loads(row['themes'])
        except:
            row['themes'] = []
            
        # 숫자 필드 변환
        row['id'] = int(row['id'])
        row['minPlayers'] = int(row['min_players'])
        row['maxPlayers'] = int(row['max_players'])
        row['playTime'] = int(row['play_time'])
        row['difficulty'] = int(row['complexity'])
        
        # 불필요한 필드 제거 및 이름 변경
        del row['min_players']
        del row['max_players']
        del row['play_time']
        del row['complexity']
        
        games.append(row)

with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
    json.dump(games, jsonfile, ensure_ascii=False, indent=2)

print(f"Converted {len(games)} games to {json_file_path}")
