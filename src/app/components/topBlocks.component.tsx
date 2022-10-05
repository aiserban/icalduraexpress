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
import axios from 'axios';

export function TopBlocks() {
    const ip = '192.168.0.174';
    const port = '3005';
    const [data, setData] = useState({ labels: [''], issueCount: [0] })

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Zile cu avarii',
                data: data.issueCount,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                maxBarThickness: 20,
                borderWidth: 1,
                borderColor: 'red',
            }
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                },
            },
            title: {
                display: true,
                text: 'Cele mai multe avarii',
            },
        },
        layout: {
            padding: 10
        },
        scales: {
            x: {

                title: {
                    text: 'Strada si bloc',
                    display: true,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
            },
            y: {
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
        getData();
    }, [])

    const getData = () => {
        axios.get(`http://${ip}:${port}/api/top/blocks/20`).then(res => {
            const results = res.data as [{ street: string, block: string, count: number }]
            const labels = results.map(item => `${item.street} bl. ${item.block}`)
            const issueCount = results.map(item => item.count)
            setData({ labels: labels, issueCount: issueCount })
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            <Bar data={chartData} options={options}></Bar>
        </div>
    )
}