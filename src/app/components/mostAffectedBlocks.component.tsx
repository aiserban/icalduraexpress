import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import DataLabels from 'chartjs-plugin-datalabels'
import { Bar } from 'react-chartjs-2';

export default function MostAffectedBlocks(props: { labels: string[], data: number[] }) {
    const [labels, setLabels] = useState(props.labels);
    const [data, setData] = useState(props.data)

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Zile cu avarie',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                maxBarThickness: 20,
                borderWidth: 1,
                borderColor: 'red',
            }
        ],
    }

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
        DataLabels
    );

    ChartJS.defaults.set('plugins.datalabels', {
        color: 'black',
        font: {
            size: 14
        },
        anchor: 'end',
        align: 'top',
        offset: -2
    });

    ChartJS.defaults.animation = false;
    ChartJS.defaults.font.size = 14;
    ChartJS.defaults.font.weight = 'bold'

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            title: {
                display: true,
                text: 'Istoric avarii in ultimele 90 zile',
            },
        },
        layout: {
            padding: 10
        },
        scales: {
            x: {

                title: {
                    text: 'Bloc',
                    display: true,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
            },
            y: {
                max: 100,
                ticks: {
                    stepSize: 10,
                    font: {
                        weight: 'normal'
                    }
                }
            }
        },
    };

    useEffect(() => {
        setLabels(props.labels);
        setData(props.data)
    }, [props]);

    return (
        <div>
            <Bar data={chartData} options={options} />
        </div>
    )
}