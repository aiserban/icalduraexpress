import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import axios from 'axios';
import { subDays } from 'date-fns';
import { AppConfig } from '../../../app.config';

export function HistoricalDataForStreetChart(props: { street: string | null, onClickedBlock: (street: string) => void }) {
    let selectedStreet = props.street;
    const [data, setData] = useState({ labels: [''], issueCount: [0], noIssueCount: [0] })
    const [hidden, setHidden] = useState(true);
    const daysAgo = 30;

    const getHistoricalDataForStreet = () => {
        const from = subDays(new Date(), daysAgo);
        axios.get(`http://${AppConfig.uri}:${AppConfig.port}/api/issue/${selectedStreet}/all/${from}`).then((res) => {
            const incomingData = (res.data as [{ block: string, issueCount: number, noIssueCount: number }]);
            const data = {
                labels: incomingData.map(item => { return item.block }),
                issueCount: incomingData.map(item => { return item.issueCount }),
                noIssueCount: incomingData.map(item => { return item.noIssueCount })
            }

            setData(data);
        }).catch(err => {
            console.log(err)
        })
    }

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const chart = Chart.getChart(event.currentTarget);

        if (chart) {
            const elem = chart.getElementsAtEventForMode(event.nativeEvent, 'nearest', { intersect: true }, true);
            try {
                const index = elem[0].index;
                const clickedBlock = chartData.labels[index];
                props.onClickedBlock(clickedBlock);
            }
            catch (err) {
                console.log(err);
            }
        }

        // props.onClickedBlock(res)
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
            },
            {
                label: 'Functionare normala',
                data: data.noIssueCount,
                backgroundColor: '#95ccfc',
                maxBarThickness: 20,
                borderWidth: 1,
                borderColor: 'blue',
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
                text: `Situatie avarii in ultimele ${daysAgo} zile`,
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
                max: daysAgo,
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
        if (selectedStreet !== null && selectedStreet.length > 0) {
            getHistoricalDataForStreet();
            setHidden(false);
        } else {
            setHidden(true);
        }
    }, [selectedStreet]);

    return (
        <div hidden={hidden}>
            <Bar
                onClick={event => handleClick(event)}
                data={chartData}
                options={options} />
        </div>
    )
}