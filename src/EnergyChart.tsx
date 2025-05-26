import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the necessary components with ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Sample processed data (replace with your actual data fetching and processing)
const processRawData = (rawData) => {
    // rawData would be an array of objects like your initial example
    // This is a simplified example. You'll need to aggregate your data
    // if you have multiple readings per hour from different 'Gerencia'.

    const labels = Array.from({ length: 24 }, (_, i) => i.toString()); // Hours 0-23

    const demandaData = Array(24).fill(null);
    const generacionData = Array(24).fill(null);
    const pronosticoData = Array(24).fill(null);

    // Example: Summing values for each hour
    // Adjust this logic based on your actual data structure and aggregation needs
    rawData.forEach(item => {
        const hour = parseInt(item.HoraOperacion, 10);
        if (hour >= 0 && hour <= 23) {
            // If you have multiple 'Gerencia' per hour, you need to sum them up or average them.
            // This example assumes your data is already structured or you sum it here.
            // For simplicity, let's assume rawData might contain one entry per hour after your pre-processing.
            // Or, if you have multiple, you would accumulate:
            // demandaData[hour] = (demandaData[hour] || 0) + parseInt(item.Demanda);
            // generacionData[hour] = (generacionData[hour] || 0) + parseInt(item.Generacion);
            // pronosticoData[hour] = (pronosticoData[hour] || 0) + parseInt(item.Pronostico);

            // For this example, let's assume direct assignment for simplicity if data is pre-aggregated per hour
            demandaData[hour] = parseInt(item.Demanda);
            generacionData[hour] = parseInt(item.Generacion);
            pronosticoData[hour] = parseInt(item.Pronostico);
        }
    });

    return {
        labels,
        demandaData,
        generacionData,
        pronosticoData,
    };
};


const EnergyChart = ({ rawAPIData }) => { // rawAPIData would be the full list from your backend
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        // Replace this with your actual data fetching logic if data comes from an API
        // For now, using the passed rawAPIData and processing it.
        // This is a placeholder for where you'd fetch or receive your full dataset.
        const initialRawData = rawAPIData || [
            // Example: Add more data points for different hours here
            // This should ideally come from an API or props
            { HoraOperacion: '0', Demanda: '1500', Generacion: '1400', Pronostico: '1450' },
            { HoraOperacion: '1', Demanda: '1450', Generacion: '1350', Pronostico: '1400' },
            // ... (data for hours 2-11)
            { Id: 8411, FechaOperacion: '2025-05-26', HoraOperacion: '12', Demanda: '2209', Generacion: '2039', Pronostico: '2029', Gerencia: 'Baja California', Sistema: 'BCA' },
            // Let's assume we have some data for other Gerencias at hour 12 too for aggregation example
            { Id: 8413, FechaOperacion: '2025-05-26', HoraOperacion: '12', Demanda: '7510', Generacion: '4582', Pronostico: '7571', Gerencia: 'Central', Sistema: 'SIN' },
            // ... (data for hours 13-23)
            { HoraOperacion: '23', Demanda: '1800', Generacion: '1900', Pronostico: '1850' },
        ];

        // --- Data Processing for the Chart ---
        // This part aggregates data if multiple entries exist for the same hour.
        const aggregatedData = {}; // Key: hour, Value: {demanda, generacion, pronostico}

        initialRawData.forEach(item => {
            const hour = parseInt(item.HoraOperacion, 10);
            if (!aggregatedData[hour]) {
                aggregatedData[hour] = { demanda: 0, generacion: 0, pronostico: 0 };
            }
            aggregatedData[hour].demanda += parseInt(item.Demanda);
            aggregatedData[hour].generacion += parseInt(item.Generacion);
            aggregatedData[hour].pronostico += parseInt(item.Pronostico);
        });

        const labels = Array.from({ length: 24 }, (_, i) => i.toString()); // Hours 0-23
        const demandaValues = Array(24).fill(null);
        const generacionValues = Array(24).fill(null);
        const pronosticoValues = Array(24).fill(null);

        labels.forEach((hourStr, index) => {
            const hour = parseInt(hourStr, 10);
            if (aggregatedData[hour]) {
                demandaValues[index] = aggregatedData[hour].demanda;
                generacionValues[index] = aggregatedData[hour].generacion;
                pronosticoValues[index] = aggregatedData[hour].pronostico;
            }
        });
        // --- End of Data Processing ---


        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Demanda (MW)',
                    data: demandaValues,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1 // Makes the line a bit curved
                },
                {
                    label: 'Generacion (MW)',
                    data: generacionValues,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Pronostico (MW)',
                    data: pronosticoValues,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.1
                },
            ],
        });
    }, [rawAPIData]); // Re-run effect if rawAPIData changes

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Demanda, Generación y Pronóstico por Hora',
            },
        },
        scales: {
            y: {
                beginAtZero: true, // Or false if you prefer
                title: {
                    display: true,
                    text: 'Energía (MW)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Hora del Día'
                }
            }
        },
    };

    return (
        <div style={{ width: '80%', margin: 'auto' }}>
            <h2>Análisis de Energía Horario</h2>
            {chartData.labels.length > 0 ? (
                <Line options={options} data={chartData} />
            ) : (
                <p>Cargando datos del gráfico...</p>
            )}
        </div>
    );
};

export default EnergyChart;

// How to use it in another component (e.g., App.js):
//
// import EnergyChart from './EnergyChart';
//
// function App() {
//   // const [yourFullData, setYourFullData] = useState([]);
//   // useEffect(() => {
//   //   // Fetch your data from API here and setYourFullData
//   // }, []);
//
//   // For testing, you can pass the sample data directly or fetch it.
//   // This example uses the sample data defined within EnergyChart if rawAPIData is not provided.
//   return (
//     <div className="App">
//       <EnergyChart rawAPIData={/* your fetched array of data objects */} />
//     </div>
//   );
// }
//
// export default App;