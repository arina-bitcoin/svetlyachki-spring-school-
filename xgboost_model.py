import pandas as pd
import numpy as np
import pickle
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, mean_pinball_loss

def wape(y_true, y_pred):
    return np.sum(np.abs(y_true - y_pred)) / np.sum(y_true) * 100

# Загрузка данных
df = pd.read_csv('data/new_train_df.csv')
df['sale_date'] = pd.to_datetime(df['sale_date'])

# Удаляем ковид
start_date = '2020-03-01'
end_date = '2021-07-01'
df = df[~((df['sale_date'] >= start_date) & (df['sale_date'] <= end_date))]

# Признаки
feature_columns = [
    'sale_hour', 'hour_sin', 'weekday', 'month', 'year',
    'temperature', 'is_rain', 'lag_7_day', 'ma_7_day', 'is_holiday'
]

X = df[feature_columns]
y = df['guests_count']

# Валидация
n = len(X)
train_end = int(n * 0.6)
val_end = int(n * 0.8)

X_train, y_train = X.iloc[:train_end], y.iloc[:train_end]
X_val, y_val = X.iloc[train_end:val_end], y.iloc[train_end:val_end]
X_test, y_test = X.iloc[val_end:], y.iloc[val_end:]

# Перебор параметров и обучение модели
print("Подбор параметров")

param_grid = [
    (400, 0.05, 8, 7, 0.8, 0.8, 0, 1, 0),
    (500, 0.04, 8, 7, 0.8, 0.8, 0, 1, 0),
    (500, 0.03, 9, 10, 0.8, 0.8, 0, 1, 0),
    (600, 0.03, 9, 10, 0.8, 0.8, 0, 1, 0),
    (600, 0.02, 10, 15, 0.8, 0.8, 0.1, 1.5, 0),
    (700, 0.02, 10, 15, 0.85, 0.85, 0.1, 1.5, 0.5),
    (800, 0.015, 11, 20, 0.85, 0.85, 0.2, 2, 0.5),
    (1000, 0.01, 12, 25, 0.9, 0.9, 0.2, 2, 1),
]

best_wape = float('inf')
best_params = None
best_model = None

for n_est, lr, depth, min_child, subsample, colsample, gamma, reg_lambda, reg_alpha in param_grid:
    model = xgb.XGBRegressor(
        n_estimators=n_est,
        learning_rate=lr,
        max_depth=depth,
        min_child_weight=min_child,
        subsample=subsample,
        colsample_bytree=colsample,
        gamma=gamma,
        reg_lambda=reg_lambda,
        reg_alpha=reg_alpha,
        random_state=42,
        objective='reg:absoluteerror',
        early_stopping_rounds=100,
        eval_metric='mae'
    )

    model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)

    y_pred = np.maximum(0, np.round(model.predict(X_val)))
    wape_val = wape(y_val, y_pred)

    print(f"n={n_est}, lr={lr}, depth={depth}, min_child={min_child}, "
          f"subsample={subsample}, gamma={gamma} → WAPE={wape_val:.2f}%")

    if wape_val < best_wape:
        best_wape = wape_val
        best_params = (n_est, lr, depth, min_child, subsample, colsample, gamma, reg_lambda, reg_alpha)
        best_model = model

# Лучшие параметры
print("\n Лучшие параметры")
print(f"n_estimators: {best_params[0]}")
print(f"learning_rate: {best_params[1]}")
print(f"max_depth: {best_params[2]}")
print(f"min_child_weight: {best_params[3]}")
print(f"subsample: {best_params[4]}")
print(f"colsample_bytree: {best_params[5]}")
print(f"gamma: {best_params[6]}")
print(f"reg_lambda: {best_params[7]}")
print(f"reg_alpha: {best_params[8]}")
print(f"WAPE на валидации: {best_wape:.2f}%")

# Оценка на тестах
y_pred = best_model.predict(X_test)
y_pred = np.maximum(0, np.round(y_pred))

print("\n Оценка на тесте")
print(f"WAPE: {wape(y_test, y_pred):.2f}%")
print(f"Pinball Loss: {mean_pinball_loss(y_test, y_pred):.2f}")
print(f"MAE: {mean_absolute_error(y_test, y_pred):.2f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")
print(f"R²: {r2_score(y_test, y_pred):.4f}")

# Важность признаков
importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)

print(f"\n Важность признаков")
print(importance.to_string(index=False))

# Сохранение
best_model.save_model('model_data/guests_model.json')
with open('model_data/feature_columns.pkl', 'wb') as f:
    pickle.dump(feature_columns, f)

print("\n Модель сохранена: model_data/guests_model.json")