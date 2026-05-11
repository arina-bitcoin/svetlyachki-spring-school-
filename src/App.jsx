import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useSimulationStore } from './store/useSimulationStore'
import { loadForecast, loadSchedule, loadDemand } from './api/dataService'
import { Layout } from './components/Layout'
import VizPage from './pages/VizPage'
import EmployeeSearchPage from './pages/EmployeeSearchPage'
import ChartsPage from './pages/ChartsPage'
import GanttPage from './pages/GanttPage'  // ← добавить импорт

function App() {
  const { setForecast, setSchedule, setDemand } = useSimulationStore()
  
  useEffect(() => {
    Promise.all([loadForecast(), loadSchedule(), loadDemand()])
      .then(([forecast, schedule, demand]) => {
        console.log('✅ Данные загружены:');
        console.log('  📊 forecast:', forecast?.length || 0, 'записей');
        console.log('  👥 schedule:', schedule?.length || 0, 'записей');
        console.log('  📋 demand:', demand?.length || 0, 'записей');
        setForecast(forecast);
        setSchedule(schedule);
        setDemand(demand);
      })
      .catch(err => {
        console.error('❌ Ошибка загрузки данных:', err);
      });
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<VizPage />} />
          <Route path="viz" element={<VizPage />} />
          <Route path="search" element={<EmployeeSearchPage />} />
          <Route path="charts" element={<ChartsPage />} />
          <Route path="gantt" element={<GanttPage />} />  
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App