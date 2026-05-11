import React, { useEffect } from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import GuestsForecastChart from '../components/charts/GuestsForecastChart';
import TotalStaffChart from '../components/charts/TotalStaffChart';
import StationsStaffChart from '../components/charts/StationsStaffChart';

export default function ChartsPage() {
    // Берем данные из store (уже загружены в App.jsx)
    const forecast = useSimulationStore((state) => state.forecast);
    const demand = useSimulationStore((state) => state.demand);
    const setDemand = useSimulationStore((state) => state.setDemand);

    // Только если demand еще не загружен, загружаем его
    useEffect(() => {
        if (demand.length === 0) {
            fetch('/data/demand.json')
                .then(res => {
                    if (!res.ok) throw new Error('Ошибка загрузки demand.json');
                    return res.json();
                })
                .then(data => {
                    setDemand(data);
                })
                .catch(err => {
                    console.error("Ошибка загрузки demand:", err);
                });
        }
    }, [demand.length, setDemand]);

    // Проверка наличия данных
    if (!forecast || forecast.length === 0) {
        return (
            <div style={{ 
                padding: '2rem', 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#666' }}>Загрузка данных прогноза...</p>
                </div>
            </div>
        );
    }

    if (!demand || demand.length === 0) {
        return (
            <div style={{ 
                padding: '2rem', 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#666' }}>Загрузка данных потребности в сотрудниках...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '2rem', 
            minHeight: '100vh', 
            backgroundColor: '#f5f5f5',
            overflowY: 'auto'
        }}>
            <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                color: '#333'
            }}>
                Аналитика и прогнозы
            </h1>
            
            {/* График 1: Прогноз гостей */}
            <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'semibold', 
                    marginBottom: '1rem',
                    color: '#555'
                }}>
                    Прогноз количества гостей
                </h2>
                <div style={{ height: '450px' }}>
                    <GuestsForecastChart />
                </div>
            </div>

            {/* График 2: Общая потребность в сотрудниках */}
            <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'semibold', 
                    marginBottom: '1rem',
                    color: '#555'
                }}>
                    Общая потребность в сотрудниках
                </h2>
                <div style={{ height: '450px' }}>
                    <TotalStaffChart />
                </div>
            </div>

            {/* График 3: Потребность по станциям */}
            <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'semibold', 
                    marginBottom: '1rem',
                    color: '#555'
                }}>
                    Потребность в сотрудниках по станциям
                </h2>
                <div style={{ height: '450px' }}>
                    <StationsStaffChart />
                </div>
            </div>
        </div>
    );
}