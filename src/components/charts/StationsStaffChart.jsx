import React from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label
} from 'recharts';

const StationsStaffChart = () => {
    const demand = useSimulationStore((state) => state.demand); // изменено с demandData на demand
    const stations = ['BVR', 'C', 'FF', 'K', 'TS'];
    
    const stationColors = {
        BVR: '#F58220',
        C: '#2E86C1',
        FF: '#28B463',
        K: '#E74C3C',
        TS: '#8E44AD'
    };

    if (!demand || demand.length === 0) {
        return (
            <div style={{ height: '400px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#666' }}>Данных нет</p>
            </div>
        );
    }

    // Группируем данные по дате и часу
    const groupedByTime = demand.reduce((acc, item) => {
        const key = `${item.date}_${item.hour}`;
        if (!acc[key]) {
            acc[key] = {
                date: item.date,
                hour: item.hour,
                fullTime: `${item.date} ${item.hour}:00`,
                BVR: 0,
                C: 0,
                FF: 0,
                K: 0,
                TS: 0
            };
        }
        acc[key][item.station_key] = item.required;
        return acc;
    }, {});

    const chartData = Object.values(groupedByTime).sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.hour}:00:00`);
        const dateB = new Date(`${b.date}T${b.hour}:00:00`);
        return dateA - dateB;
    });

    return (
        <div style={{ width: '100%', height: '450px', background: 'white', padding: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    
                    <XAxis
                        dataKey="fullTime"
                        tickFormatter={(value) => value.split(' ')[1]}
                        interval={Math.floor(chartData.length / 10)}
                        tick={{ fontSize: 10, fill: '#999' }}
                    >
                        <Label value="Часы (день за днем)" offset={-25} position="insideBottom" fill="#666" />
                    </XAxis>
                    
                    <YAxis tick={{ fontSize: 12, fill: '#999' }}>
                        <Label value="Количество сотрудников" angle={-90} position="insideLeft" fill="#666" />
                    </YAxis>
                    
                    <Tooltip
                        labelFormatter={(label) => `Дата и время: ${label}`}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    
                    <Legend 
                        verticalAlign="top" 
                        height={36}
                        formatter={(value) => `Станция ${value}`}
                    />
                    
                    {stations.map((station) => (
                        <Line
                            key={station}
                            type="monotone"
                            dataKey={station}
                            stroke={stationColors[station]}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                            animationDuration={1500}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StationsStaffChart;