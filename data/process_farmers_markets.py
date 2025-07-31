#!/usr/bin/env python3
import csv
import json

def process_farmers_markets():
    # 读取CSV文件，手动处理列名
    with open('data/NYC_Farmers_Markets_20250719.csv', 'r', encoding='utf-8') as file:
        # 读取第一行作为列名
        header_line = file.readline().strip()
        # 读取第二行（可能包含更多列名信息）
        second_line = file.readline().strip()
        
        # 合并列名
        headers = header_line.split(',')
        if len(headers) < 16:  # 如果列名不完整，尝试合并
            second_headers = second_line.split(',')
            # 这里需要手动处理，因为列名被分割了
            headers = [
                'Borough', 'Market Name', 'Street Address', 'Community District', 
                'Latitude', 'Longitude', 'Days of Operation', 'Hours of Operations',
                'Season Begin', 'Season End', 'Accepts EBT', 'Distributes Health Bucks?',
                'Open Year-Round', 'Cooking Demonstrations', 'Location Point', 'Zip Code'
            ]
        
        # 重新定位到数据开始处
        file.seek(0)
        # 跳过前两行（列名行）
        file.readline()
        file.readline()
        
        # 读取数据
        manhattan_markets = []
        total_count = 0
        
        for line in file:
            total_count += 1
            row_data = line.strip().split(',')
            if len(row_data) >= 6:  # 确保有足够的列
                borough = row_data[0]
                if borough == 'Manhattan':
                    market = {
                        'Borough': row_data[0],
                        'Market Name': row_data[1],
                        'Street Address': row_data[2],
                        'Community District': row_data[3],
                        'Latitude': row_data[4],
                        'Longitude': row_data[5],
                        'Days of Operation': row_data[6] if len(row_data) > 6 else '',
                        'Hours of Operations': row_data[7] if len(row_data) > 7 else '',
                        'Season Begin': row_data[8] if len(row_data) > 8 else '',
                        'Season End': row_data[9] if len(row_data) > 9 else '',
                        'Accepts EBT': row_data[10] if len(row_data) > 10 else '',
                        'Distributes Health Bucks?': row_data[11] if len(row_data) > 11 else '',
                        'Open Year-Round': row_data[12] if len(row_data) > 12 else '',
                        'Cooking Demonstrations': row_data[13] if len(row_data) > 13 else '',
                        'Location Point': row_data[14] if len(row_data) > 14 else '',
                        'Zip Code': row_data[15] if len(row_data) > 15 else ''
                    }
                    manhattan_markets.append(market)

    print(f'原始数据: {total_count} 行')
    print(f'曼哈顿数据: {len(manhattan_markets)} 行')
    print('\n曼哈顿农贸市场列表:')
    for market in manhattan_markets:
        print(f"  {market['Market Name']} - {market['Street Address']}")

    # 创建GeoJSON格式
    features = []
    for market in manhattan_markets:
        try:
            lat = float(market['Latitude'])
            lng = float(market['Longitude'])
            
            feature = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [lng, lat]
                },
                'properties': {
                    'market_name': market['Market Name'],
                    'street_address': market['Street Address'],
                    'days_of_operation': market['Days of Operation'],
                    'hours_of_operations': market['Hours of Operations'],
                    'accepts_ebt': market['Accepts EBT'],
                    'open_year_round': market['Open Year-Round']
                }
            }
            features.append(feature)
        except (ValueError, TypeError) as e:
            print(f'跳过无效坐标: {market["Market Name"]} - {e}')

    geojson = {
        'type': 'FeatureCollection',
        'features': features
    }

    # 保存GeoJSON文件
    with open('manhattan_farmers_markets.geojson', 'w', encoding='utf-8') as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)

    print(f'\n成功创建 {len(features)} 个农贸市场点')
    print('GeoJSON文件已保存为: manhattan_farmers_markets.geojson')
    
    return len(features)

if __name__ == "__main__":
    process_farmers_markets() 