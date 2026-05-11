// src/pages/ChartsPage.jsx
import React, { useEffect } from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import GuestsForecastChart from '../components/charts/GuestsForecastChart';

export default function ChartsPage() {
    // Берем экшен из вашего стора
    const setForecast = useSimulationStore((state) => state.setForecast);

    useEffect(() => {
        // Имитируем или выполняем загрузку данных
        fetch('/data/forecast.json')
            .then(res => res.json())
            .then(data => {
                setForecast(data); // Записываем данные в стор
            })
            .catch(err => console.error("Ошибка загрузки:", err));
    }, [setForecast]);

    return (
        <div style={{ padding: '2rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <h1 className="text-2xl font-bold mb-4">Аналитика</h1>
            <div style={{ flex: 1, minHeight: '400px' }}>
                <GuestsForecastChart />
            </div>
        </div>
    );
}