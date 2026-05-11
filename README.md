# svetlyachki-spring-school-

## frontend 
```plaintext
project-root/
├── public/
│   ├── assets/
│   │   ├── background.png                    # фон зала 
│   │   ├── animated_cook.gif                 # анимированный повар 
│   │   ├── stations/                         # иконки станций
│   │   │   ├── counter.png
│   │   │   ├── kitchen.png
│   │   │   ├── drinks.png
│   │   │   ├── fries.png
│   │   │   ├── hall.png
│   │   │   ├── counter2.png
│   │   │   ├── kitchen2.png
│   │   │   ├── cup2.png
│   │   │   └── fries2.png
│   │   ├── employees/
│   │   │   └── chef.svg
│   │   └── ui/
│   │       ├── play.svg
│   │       ├── pause.svg
│   │       └── star.svg
│   │
│   └── data/
│       ├── forecast.json                     # прогноз гостей (7 дней)
│       ├── schedule.json                     # расписание сотрудников
│       └── demand.json                       # требуемое количество сотрудников 
│
├── src/
│   ├── api/
│   │   └── dataService.js                    # загрузка forecast, schedule, demand
│   │
│   ├── store/
│   │   └── useSimulationStore.js             # Zustand: forecast, schedule, demand, часы, дата, play/pause
│   │
│   ├── components/
│   │   ├── Layout.jsx                        # навигация (/viz, /search, /charts, /gantt)
│   │   │
│   │   ├── visualization/                    # СТРАНИЦА ВИЗУАЛИЗАЦИИ (мультик)
│   │   │   ├── VizPageContent.jsx            # собирает всё вместе
│   │   │   ├── StationsGrid.jsx              # грид карточек станций
│   │   │   ├── StationCard.jsx               # карточка станции
│   │   │   ├── AnimateMap.jsx                # карта с фоном и мебелью 
│   │   │   ├── EmployeeIcon.jsx              # иконка сотрудника с анимацией
│   │   │   ├── StationDetails.jsx            # боковая панель с деталями
│   │   │   ├── TechnicalOverlay.jsx          # техническая сводка
│   │   │   └── TimeControls.jsx              # управление временем
│   │   │
│   │   ├── employeeSearch/                   # СТРАНИЦА ПОИСКА СОТРУДНИКА
│   │   │   ├── EmployeeSearchPage.jsx        # форма поиска
│   │   │   ├── EmployeeScheduleTable.jsx     # таблица расписания
│   │   │   └── EmployeeStats.jsx             # статистика сотрудника
│   │   │
│   │   ├── charts/                           # СТРАНИЦА ГРАФИКОВ
│   │   │   ├── ChartsPageContent.jsx         # контейнер с выбором дня
│   │   │   └── EmployeesVsGuestsChart.jsx    # график сотрудники vs гости
│   │   │
│   │   ├── gantt/                            # ОТДЕЛЬНАЯ СТРАНИЦА ГАНТА (добавлена)
│   │   │   └── GanttChartPage.jsx            # полноэкранная диаграмма Ганта
│   │   │
│   │   └── common/
│   │       ├── ParticleEffect.jsx            # частицы при появлении сотрудника
│   │       └── ProgressBar.jsx               # прогресс-бар покрытия
│   │
│   ├── pages/                                # СТРАНИЦЫ-ОБЁРТКИ ДЛЯ РОУТОВ
│   │   ├── VizPage.jsx                       # обёртка визуализации
│   │   ├── EmployeeSearchPage.jsx            # обёртка поиска
│   │   ├── ChartsPage.jsx                    # обёртка графиков
│   │   └── GanttPage.jsx                     # обёртка диаграммы Ганта (добавлена)
│   │
│   ├── hooks/
│   │   ├── useSimulationTimer.js             # авто-переключение часов
│   │   └── useEmployeesByHour.js             # фильтрация сотрудников по часу/дате
│   │
│   ├── utils/
│   │   ├── stationPositions.js               # координаты станций для карты (добавлен)
│   │   ├── convertSchedule.js                # конвертация расписания
│   │   └── colors.js                         # цветовая схема
│   │
│   ├── App.jsx                               # роутер 
│   ├── main.jsx                              # точка входа
│   └── index.css                             # глобальные стили
│
├── .env
├── package.json                              # зависимости
├── vite.config.js                            # конфиг Vite
├── Svetlyachki.ipynb                         # Алгоритм составления расписания + форматирование в JSON
└── README.md