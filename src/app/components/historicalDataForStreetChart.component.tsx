import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { subDays } from 'date-fns';
import { AppConfig } from '../../../app.config';

export function HistoricalDataForStreetChart(props: { selectedStreet: string }) {
    const selectedStreet = props.selectedStreet;
    const [data, setData] = useState({ labels: [''], issueCount: [0], noIssueCount: [0] })
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
        if (selectedStreet.length > 0) {
            getHistoricalDataForStreet();
        }
    }, [selectedStreet]);

    return (
        <div>
            <Bar data={chartData} options={options} />
        </div>
    )
}