import pandas as pd
import numpy as np
import openmeteo_requests
from datetime import datetime, timedelta

# Исторические данные
df_hist = pd.read_csv('data/new_train_df.csv')
df_hist['sale_date'] = pd.to_datetime(df_hist['sale_date'])

last_week_start = df_hist['sale_date'].max() - timedelta(days=7)
df_lag = df_hist[df_hist['sale_date'] >= last_week_start]
lag_dict = {(row['sale_hour'], row['sale_date'].weekday()): row['guests_count'] for _, row in df_lag.iterrows()}

# Прогноз погоды
openmeteo = openmeteo_requests.Client()
params = {
    "latitude": 55.8008, "longitude": 37.5322,
    "start_date": "2026-04-27", "end_date": "2026-05-03",
    "hourly": ["temperature_2m", "precipitation"],
    "timezone": "Europe/Moscow"
}
response = openmeteo.weather_api("https://api.open-meteo.com/v1/forecast", params=params)
hourly = response[0].Hourly()

weather = pd.DataFrame({
    "datetime": pd.date_range(
        start=pd.to_datetime(hourly.Time(), unit="s", utc=False),
        periods=len(hourly.Variables(0).ValuesAsNumpy()), freq='h'
    ),
    "temperature": hourly.Variables(0).ValuesAsNumpy(),
    "precipitation": hourly.Variables(1).ValuesAsNumpy(),
})
weather["hour"] = weather["datetime"].dt.hour
weather["date"] = weather["datetime"].dt.date

# Функции для признаков
def get_weather(row):
    w = weather[(weather['date'] == row['sale_date'].date()) & (weather['hour'] == row['sale_hour'])]
    if len(w) > 0:
        return w['temperature'].values[0], 1 if w['precipitation'].values[0] > 0.5 else 0
    return 10, 0

def get_ma_7_day(date, hour):
    start = date.date() - timedelta(days=7)
    week = df_hist[(df_hist['sale_date'].dt.date >= start) &
                   (df_hist['sale_date'].dt.date < date.date()) &
                   (df_hist['sale_hour'] == hour)]
    return week['guests_count'].mean() if len(week) > 0 else 50

# Создание датафрейм для погоды
dates = []
current = datetime(2026, 4, 27)
end = datetime(2026, 5, 3)

while current <= end:
    for hour in range(7, 23):
        dates.append({'sale_date': current, 'sale_hour': hour})
    current += timedelta(days=1)

df = pd.DataFrame(dates)
df['sale_date'] = pd.to_datetime(df['sale_date'])
df['weekday'] = df['sale_date'].dt.dayofweek
df['month'] = df['sale_date'].dt.month
df['year'] = df['sale_date'].dt.year
df['hour'] = df['sale_hour']

# Погода
df[['temperature', 'is_rain']] = df.apply(lambda r: pd.Series(get_weather(r)), axis=1)

# Лаги
df['lag_7_day'] = df.apply(lambda r: lag_dict.get((r['sale_hour'], r['weekday']), 40), axis=1)

df['hour_sin'] = np.sin(2 * np.pi * df['sale_hour'] / 24)

# ma_7_day
df['ma_7_day'] = df.apply(lambda r: get_ma_7_day(r['sale_date'], r['sale_hour']), axis=1)

# Праздники
holidays = [(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),
            (2,23),(3,8),(5,1),(5,2),(5,3),(5,9),(6,12),(11,4)]
df['is_holiday'] = df['sale_date'].apply(lambda d: 1 if (d.month, d.day) in holidays else 0)

# 5 Сохранение
column_order = [
    'sale_date', 'sale_hour', 'weekday', 'month', 'year', 'hour',
    'temperature', 'is_rain',
    'lag_7_day',  'hour_sin', 'ma_7_day', 'is_holiday'
]

df = df[column_order].sort_values(['sale_date', 'sale_hour'])
df.to_csv('model_data/forecast_features.csv', index=False)

print(f"Сохранён: forecast_features.csv")