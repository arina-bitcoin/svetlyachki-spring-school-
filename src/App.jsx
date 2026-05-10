import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useSimulationStore } from './store/useSimulationStore'
import { loadForecast, loadSchedule } from './api/dataService'
import { Layout } from './components/Layout'
import VizPage from './pages/VizPage'
import EmployeeSearchPage from './pages/EmployeeSearchPage'
import ChartsPage from './pages/ChartsPage'

function App() {
  const { setForecast, setSchedule } = useSimulationStore()
  
  useEffect(() => {
    Promise.all([loadForecast(), loadSchedule()]).then(([forecast, schedule]) => {
      setForecast(forecast)
      setSchedule(schedule)
    })
  }, [])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<VizPage />} />
          <Route path="viz" element={<VizPage />} />
          <Route path="search" element={<EmployeeSearchPage />} />
          <Route path="charts" element={<ChartsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App