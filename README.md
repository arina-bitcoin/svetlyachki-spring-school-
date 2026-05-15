# Прогнозирование числа гостей

## Задача
Спрогнозировать количество гостей ресторана на 7 дней (27.04.2026 – 03.05.2026) для оптимизации расписания сотрудников.

## Данные
- 40k+ часовых записей (2019–2026)
- Удалён ковидный период (03.2020 – 07.2021)

## Признаки
- недельные лаги (`lag_7_day`, `lag_14_day`, `lag_21_day`, `lag_28_day`)
- скользящие средние (`ma_7_day`)
- погода (температура, осадки)
- синус часа (`hour_sin`)
- праздники (`is_holiday`, `is_pre_holiday`)

## Модели
| Модель | WAPE | MAE | R² |
|--------|------|-----|-----|
| **XGBoost** | **7.54%** | 8.08 | 0.93 |
| CatBoost | 8.21% | 9.21 | 0.91 |
| Prophet | ~11% | ~13 | 0.85 |

## Метрики
- **WAPE** – основная (ошибка 7.54% от общего потока гостей)
- **Pinball Loss (alpha=0.9)** – штраф за недопрогноз в 9 раз выше перепрогноза

## Структура
├── data/ 
├── model_data/ 
├── build_features.py 
├── xgboost_model.py 
├── prepare_forecast_data.py 
├── generate_table.py 

## Запуск
```bash
python build_features.py
python xgboost_model.py
python prepare_forecast_data.py
python generate_table.py
