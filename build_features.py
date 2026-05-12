import pandas as pd
import openmeteo_requests
import numpy as np

df = pd.read_csv('data/train.csv')
df['sale_date'] = pd.to_datetime(df['sale_date'])

# Удаление ковида
start_date = '2020-03-01'
end_date = '2021-07-01'
df = df[~((df['sale_date'] >= start_date) & (df['sale_date'] <= end_date))]

df['weekday'] = df['sale_date'].dt.dayofweek
df['month'] = df['sale_date'].dt.month
df['year'] = df['sale_date'].dt.year
df['hour'] = df['sale_hour']

# погода
openmeteo = openmeteo_requests.Client()
params = {
    "latitude": 55.8008,
    "longitude": 37.5322,
    "start_date": df['sale_date'].min().strftime('%Y-%m-%d'),
    "end_date": df['sale_date'].max().strftime('%Y-%m-%d'),
    "hourly": ["temperature_2m", "precipitation"],
    "timezone": "Europe/Moscow"
}

response = openmeteo.weather_api("https://archive-api.open-meteo.com/v1/archive", params=params)
hourly = response[0].Hourly()

weather_data = pd.DataFrame({
    "datetime": pd.date_range(
        start=pd.to_datetime(hourly.Time(), unit="s", utc=False),
        periods=len(hourly.Variables(0).ValuesAsNumpy()),
        freq='h'
    ),
    "temperature": hourly.Variables(0).ValuesAsNumpy(),
    "precipitation": hourly.Variables(1).ValuesAsNumpy(),
})
weather_data["hour_weather"] = weather_data["datetime"].dt.hour
weather_data["date"] = weather_data["datetime"].dt.date

df['date_only'] = df['sale_date'].dt.date
df = df.merge(weather_data[['date', 'hour_weather', 'temperature', 'precipitation']],
              left_on=['date_only', 'sale_hour'], right_on=['date', 'hour_weather'], how='left')

df['is_rain'] = (df['precipitation'] > 0.5).astype(int)
df = df.drop(['precipitation', 'date_only', 'date', 'hour_weather'], axis=1)

# lag_7_day
df = df.sort_values(['sale_date', 'sale_hour'])
df['lag_7_day'] = df.groupby('hour')['guests_count'].shift(7).fillna(df['guests_count'].median())

# ma_7_day
df['ma_7_day'] = df.groupby('hour')['guests_count'].transform(
    lambda x: x.rolling(7, min_periods=1).mean()
)
df['ma_7_day'] = df['ma_7_day'].fillna(df['guests_count'].median())

# sin_hour
hour_rad = 2 * np.pi * df['sale_hour'] / 24
df['hour_sin'] = np.sin(hour_rad)

# Праздники
def is_holiday(date):
    holidays_fixed = [
        (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),
        (2,23),(3,8),(5,1),(5,2),(5,3),(5,9),(6,12),(11,4)
    ]
    return 1 if (date.month, date.day) in holidays_fixed else 0

df['is_holiday'] = df['sale_date'].apply(is_holiday)

# Сохранение
df.to_csv('data/new_train_df.csv', index=False)
print(f"Сохранено")