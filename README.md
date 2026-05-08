# svetlyachki-spring-school-

## frontend 
'''plaintext
project-root/
├── public/
│   └── assets/                       # все картинки, спрайты (Phaser грузит по прямым путям)
│       ├── stations/
│       ├── employees/
│       └── ui/
│
├── src/
│   ├── algorithms/                   # прогноз + расписание (чистые функции)
│   │   ├── forecast.js
│   │   ├── scheduling.js
│   │   └── constraints.js
│   │
│   ├── store/                        # глобальное состояние (Zustand)
│   │   └── useSimulationStore.js     # currentDay, currentHour, isPlaying, schedule, forecast
│   │
│   ├── game/                         # Phaser – только отрисовка
│   │   ├── config.js
│   │   ├── main.js                   # фабрика: mountGame(container, props)
│   │   ├── scenes/
│   │   │   └── GameScene.js          # получает schedule, currentHour через props при старте
│   │   └── helpers/
│   │       └── drawUtils.js
│   │
│   ├── components/
│   │   ├── Layout.jsx                # общая шапка, навигация по трём страницам
│   │   │
│   │   ├── visualization/            # компоненты для главной (VizPage)
│   │   │   ├── GameContainer.jsx     # монтирует Phaser, подписывается на store
│   │   │   ├── TechnicalOverlay.jsx  # таблица покрытия (через store)
│   │   │   ├── TimeControls.jsx      # слайдер, play/pause (изменяют store)
│   │   │   └── StationDetails.jsx    # всплывающая панель при клике на станцию (через store)
│   │   │
│   │   ├── employeeSearch/           # компоненты для страницы сотрудников
│   │   │   ├── EmployeeSearchPage.jsx
│   │   │   ├── EmployeeScheduleTable.jsx
│   │   │   └── EmployeeStats.jsx
│   │   │
│   │   └── charts/                   # компоненты для страницы графиков
│   │       └── ChartsPage.jsx        # Recharts / Chart.js
│   │
│   ├── pages/                        # три страницы по роутам
│   │   ├── VizPage.jsx               # GameContainer + TechnicalOverlay + TimeControls
│   │   ├── EmployeeSearchPage.jsx    # EmployeeSearchPage + компоненты
│   │   └── ChartsPage.jsx            # ChartsPage + графики
│   │
│   ├── App.jsx                       # BrowserRouter, Routes, Route, Layout
│   ├── index.js
│   └── index.css
'''
