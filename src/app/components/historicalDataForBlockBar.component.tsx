import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { AppConfig } from '../../../app.config';
import { subDays, eachDayOfInterval, parseISO, format } from 'date-fns';
import { isSameDay } from 'date-fns/esm';

export function HistoricalDataForBlockBar(props: { street: string | null, block: string | null }) {
    const [data, setData] = useState<{ labels: string[], deficiencies: number[], shutdowns: number[], functioning: number[] }>();
    const [hidden, setHidden] = useState(true);
    let selectedStreet = props.street;
    let selectedBlock = props.block;
    const daysAgo = 30;

    const getData = async () => {
        const from = subDays(new Date(), daysAgo);
        return axios.get(`http://${AppConfig.uri}:${AppConfig.port}/api/issue/${selectedStreet}/${selectedBlock}/${from}`).then(res => {
            const results = (res.data as [{ dateAdded: string, issueType: string }])
                .map(item => { return { dateAdded: parseISO(item.dateAdded), issueType: item.issueType } });

            const interval = eachDayOfInterval({ start: from, end: new Date() });
            const labels = interval.map(day => format(day, 'dd-MM-yyyy'));
            const deficiencies: number[] = []
            const shutdowns: number[] = []
            const functioning: number[] = []

            for (const day of interval) {
                let isDeficiency = false;
                let isShutdown = false;
                let isFunctional = true;

                for (const result of results) {
                    if (isSameDay(day, result.dateAdded) && result.issueType === 'Deficienta ACC') {
                        isDeficiency = true;
                    }
                    if (isSameDay(day, result.dateAdded) && result.issueType === 'Oprire ACC') {
                        isShutdown = true;
                    }
                }

                if (isDeficiency || isShutdown) {
                    isFunctional = false;
                }

                if (isDeficiency && isShutdown) {
                    deficiencies.push(1);
                    shutdowns.push(1);
                    functioning.push(0)
                } else if (isDeficiency && !isShutdown){
                    deficiencies.push(2);
                    shutdowns.push(0);
                    functioning.push(0)
                } else if (!isDeficiency && isShutdown) {
                    deficiencies.push(0);
                    shutdowns.push(2);
                    functioning.push(0)
                } else {
                    deficiencies.push(0);
                    shutdowns.push(0);
                    functioning.push(2);
                }
            }

            setData({ labels: labels, deficiencies: deficiencies, shutdowns: shutdowns, functioning: functioning });
        })
    }

    useEffect(() => {
        if (selectedBlock !== null && selectedStreet !== null) {
            setHidden(false);
            getData().then(() => {
                document.getElementById('historicalDataForBlockBar')?.scrollIntoView({behavior: 'smooth'})
            }).catch(err => {
                console.log(err);
            })
        } else {
            setHidden(true);
        }
    }, [selectedStreet, selectedBlock])

    const chartData = {
        labels: data?.labels,
        datasets: [
            {
                label: 'Functionare normala',
                data: data?.functioning,
                backgroundColor: '#95ccfc',
                maxBarThickness: 20,
                borderWidth: 1,
                borderColor: 'blue',
            },
            {
                label: 'Oprire ACC',
                data: data?.shutdowns,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                maxBarThickness: 20,
                borderWidth: 1,
                borderColor: 'red',
            },
            {
                label: 'Deficienta ACC',
                data: data?.deficiencies,
                backgroundColor: '#f7d46a',
                maxBarThickness: 20,
                borderWidth: 1,
                borderColor: 'orange',
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
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
                text: `Functionare in ultimele ${daysAgo} zile`,
            },
            datalabels: {
                display: false
            }
        },
        layout: {
            padding: 10,
        },
        scales: {
            x: {
                stacked: true,
                title: {
                    text: 'Data',
                    display: true,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
            },
            y: {
                stacked: true,
                max: 2,
                ticks: {
                    display: false,
                    // stepSize: 1,
                    font: {
                        weight: 'normal'
                    }
                }
            }
        },
    };


    return (
        <div id='historicalDataForBlockBar' style={{ height: 250 }} hidden={hidden}>
            <Bar data={chartData}
                options={options} />
        </div>
    )
}
