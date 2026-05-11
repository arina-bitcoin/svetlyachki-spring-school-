import React from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label
} from 'recharts';

const GuestsForecastChart = () => {
    const forecast = useSimulationStore((state) => state.forecast);

    if (!forecast || forecast.length === 0) {
        return (
            <div style={{ height: '400px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#666' }}>Данных нет</p>
            </div>
        );
    }

    // Подготавливаем данные: создаем уникальный ключ для каждой точки,
    // чтобы дни шли друг за другом
    const chartData = forecast.map((item) => ({
        ...item,
        // Формируем метку "Дата Час" для уникальности на оси X
        fullTime: `${item.date} ${item.hour}:00`
    }));

    return (
        <div style={{ width: '100%', height: '450px', background: 'white', padding: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

                    <XAxis
                        dataKey="fullTime" // Используем уникальный ключ
                        tickFormatter={(value) => value.split(' ')[1]} // Показываем только время (час)
                        interval={3} // Показываем каждый 3-й час, чтобы не было каши
                        tick={{ fontSize: 10, fill: '#999' }}
                    >
                        <Label value="Часы (день за днем)" offset={-25} position="insideBottom" fill="#666" />
                    </XAxis>

                    <YAxis tick={{ fontSize: 12, fill: '#999' }}>
                        <Label value="Гости" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#666" />
                    </YAxis>

                    <Tooltip
                        labelFormatter={(label) => `Дата и время: ${label}`}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />

                    <Line
                        type="monotone"
                        dataKey="guests_count"
                        stroke="#F58220"
                        strokeWidth={3}
                        dot={false} // Точки лучше убрать, если данных много (несколько дней)
                        activeDot={{ r: 6, fill: '#F58220' }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GuestsForecastChart;