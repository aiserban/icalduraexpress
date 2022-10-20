import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import axios from 'axios';
import { AppConfig } from '../../../app.config';

export function TopBlocksBar(props: { hidden: boolean, onClicked: (street: string, block: string) => void }) {
    const [data, setData] = useState({ labels: [''], issueCount: [0] })

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const chart = Chart.getChart(event.currentTarget);

        if (chart) {
            const elem = chart.getElementsAtEventForMode(event.nativeEvent, 'nearest', { intersect: true }, true);
            try {
                const index = elem[0].index;
                const label = chartData.labels[index];  // label here has both the street and the block, split by a dash -
                const [street, block] = label.split('-');
                props.onClicked(encodeURIComponent(street.trim()), encodeURIComponent(block.trim()));
            }
            catch (err) {
                console.log(err);
            }
        }
    }

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
                text: 'Cladiri cu cele mai multe avarii',
            },
        },
        layout: {
            padding: 10
        },
        scales: {
            x: {

                title: {
                    text: 'Strada - bloc/imobil',
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
        axios.get(`http://${AppConfig.uri}:${AppConfig.port}/api/top/blocks/20`).then(res => {
            const results = res.data as [{ street: string, block: string, count: number }]
            const labels = results.map(item => `${item.street} - ${item.block}`)
            const issueCount = results.map(item => item.count)
            setData({ labels: labels, issueCount: issueCount })
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div id='topblocksBar' hidden={props.hidden}>
            <Bar data={chartData}
             options={options}
             onClick={event => handleClick(event)} />
        </div>
    )
}