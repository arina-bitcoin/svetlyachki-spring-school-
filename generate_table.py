import pandas as pd
import numpy as np
import pickle
import xgboost as xgb
from datetime import timedelta

# Загрузка модели
model = xgb.XGBRegressor()
model.load_model('model_data/guests_model.json')

with open('model_data/feature_columns.pkl', 'rb') as f:
    feature_columns = pickle.load(f)

print("Модель загружена")

# Загрузка лагов
df = pd.read_csv('model_data/forecast_features.csv')
df['sale_date'] = pd.to_datetime(df['sale_date'])

df = df[df['sale_hour'] <= 22]

# Прогноз
df = df.sort_values(['sale_date', 'sale_hour'])
df['guests_pred'] = 0

week_history = {hour: [] for hour in range(7, 23)}

df_hist = pd.read_csv('data/new_train_df.csv')
df_hist['sale_date'] = pd.to_datetime(df_hist['sale_date'])
last_week = df_hist[df_hist['sale_date'] >= df_hist['sale_date'].max() - timedelta(days=7)]
for _, row in last_week.iterrows():
    if row['sale_hour'] <= 22:
        week_history[row['sale_hour']].append(row['guests_count'])

for idx in df.index:
    current_hour = df.loc[idx, 'sale_hour']

    if len(week_history[current_hour]) >= 7:
        df.loc[idx, 'ma_7_day'] = np.mean(week_history[current_hour][-7:])

    features = df.loc[idx, feature_columns].values.reshape(1, -1)
    pred = model.predict(features)[0]
    pred = max(0, int(round(pred)))

    df.loc[idx, 'guests_pred'] = pred

    week_history[current_hour].append(pred)
    if len(week_history[current_hour]) > 7:
        week_history[current_hour].pop(0)

# Сохранение в нужном формате
df_csv = pd.DataFrame({
    'ID': df['sale_date'].dt.strftime('%Y-%m-%d') + '-' + df['sale_hour'].astype(str).str.zfill(2),
    'guests_count': df['guests_pred']
})
df_csv.to_csv('data/guests_forecast.csv', index=False)

# Сохранение Excel
df_excel = pd.DataFrame({
    'sale_date': df['sale_date'].dt.strftime('%Y-%m-%d'),
    'sale_hour': df['sale_hour'],
    'guests_count': df['guests_pred']
})
df_excel.to_excel('data/guests_forecast.xlsx', index=False)

print("Прогноз сохранен")
print("\nПервые 10 строк csv:")
print(df_csv.head(10).to_string(index=False))