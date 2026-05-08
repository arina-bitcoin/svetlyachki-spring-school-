# svetlyachki-spring-school-

## frontend 
```plaintext
project-root/
├── public/
│   ├── assets/                            # иконки, спрайты
│   │   ├── stations/
│   │   │   ├── counter.svg
│   │   │   ├── kitchen.svg
│   │   │   ├── drinks.svg
│   │   │   ├── fries.svg
│   │   │   └── hall.svg
│   │   ├── employees/
│   │   │   └── chef.svg
│   │   └── ui/
│   │       ├── play.svg
│   │       ├── pause.svg
│   │       └── star.svg
│   │
│   └── data/                              # заглушка (или загружается по API)
│       ├── forecast.json                  # с бэка
│       └── schedule.json                  # с бэка
│
├── src/
│   ├── api/                               #
│   │   └── dataService.js                 # fetch('/data/forecast.json') и schedule.json
│   │
│   ├── store/                             # 
│   │   └── useSimulationStore.js          # forecast, schedule, currentDateIndex, currentHour, isPlaying, selectedStationKey, speed, actions
│   │
│   ├── components/
│   │   ├── Layout.jsx                     # навигация (/viz, /search, /charts)
│   │   │
│   │   ├── visualization/                 # страница с человечками
│   │   │   ├── VizPageContent.jsx         # Собирает всё: сетку станций + панель времени + техническую сводку
│   │   │   ├── StationsGrid.jsx           # Грид 5 станций, каждая – StationCard
│   │   │   ├── StationCard.jsx            # Карточка станции: иконка, список иконок сотрудников, прогресс-бар покрытия
│   │   │   ├── EmployeeIcon.jsx           # Иконка сотрудника с анимацией появления (scale) и исчезновения (exit)
│   │   │   ├── StationDetails.jsx         # Боковая панель: детальный список сотрудников на выбранной станции
│   │   │   ├── TechnicalOverlay.jsx       # Сводка: для каждой станции – факт / требование, цветовой статус
│   │   │   └── TimeControls.jsx           # Слайдер часа, кнопка Play/Pause, отображение текущей даты
│   │   │
│   │   ├── employeeSearch/                # поиск сотрудников
│   │   │   ├── EmployeeSearchPage.jsx
│   │   │   ├── EmployeeScheduleTable.jsx
│   │   │   └── EmployeeStats.jsx
│   │   │
│   │   ├── charts/                        # графики из прогноза и расписания
│   │   │   ├── ChartsPageContent.jsx
│   │   │   ├── GuestsForecastChart.jsx    # данные из forecast
│   │   │   └── CoverageHeatmap.jsx        # данные из schedule
│   │   │
│   │   └── common/
│   │       ├── ParticleEffect.jsx         # разные эффекты 
│   │       └── ProgressBar.jsx
│   │
│   ├── pages/                             # роуты
│   │   ├── VizPage.jsx
│   │   ├── EmployeeSearchPage.jsx
│   │   └── ChartsPage.jsx
│   │
│   ├── hooks/
│   │   ├── useSimulationTimer.js          # таймер
│   │   └── useEmployeesByHour.js          # выборка по текущему часу/дню из schedule
│   │
│   ├── utils/
│   │   ├── convertSchedule.js             # schedule → { date, hour, station: [emplIds] }
│   │   └── colors.js
│   │
│   ├── App.jsx                            # роутер
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
├── vite.config.js
└── README.md