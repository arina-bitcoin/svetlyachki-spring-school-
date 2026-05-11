import React from 'react';
import GuestsForecastChart from './GuestsForecastChart';

// Добавь это в начало компонента ChartsPageContent или ChartsPage
import { useEffect } from 'react';

// внутри функции компонента:
const setForecast = useSimulationStore((state) => state.setForecast);

useEffect(() => {
    // Проверь, что файл лежит в public/data/forecast.json
    fetch('/data/forecast.json')
        .then(res => res.json())
        .then(data => {
            console.log("Успешно загружено:", data);
            setForecast(data);
        })
        .catch(err => console.error("Ошибка при fetch:", err));
}, [setForecast]);

const ChartsPageContent = () => {
    return (
        <div style={{ marginTop: '20px' }}>
            {/* Обязательно задаем высоту здесь! */}
            <div style={{
                height: '450px',
                width: '100%',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                padding: '20px'
            }}>
                <GuestsForecastChart />
            </div>
        </div>
    );
};

export default ChartsPageContent;