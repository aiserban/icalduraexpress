import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { AppConfig } from '../../../app.config';
import { subDays, eachDayOfInterval, parseISO, format } from 'date-fns';
import { isSameDay } from 'date-fns/esm';

export function HistoricalDataForBlockChart(props: { street: string | null, block: string | null }) {
    const [data, setData] = useState<{ labels: string[], deficiencies: number[], shutdowns: number[], functionals: number[] }>();
    const [hidden, setHidden] = useState(true);
    let selectedStreet = props.street;
    let selectedBlock = props.block;
    const daysAgo = 30;

    const getData = () => {
        const from = subDays(new Date(), daysAgo);
        axios.get(`http://${AppConfig.uri}:${AppConfig.port}/api/issue/${selectedStreet}/${selectedBlock}/${from}`).then(res => {
            const results = (res.data as [{ dateAdded: string, issueType: string }])
                .map(item => { return { dateAdded: parseISO(item.dateAdded), issueType: item.issueType } });

            const interval = eachDayOfInterval({ start: from, end: new Date() });
            const labels = interval.map(day => format(day, 'dd-MM-yyyy'));
            const deficiencies: number[] = []
            const shutdowns: number[] = []
            const functionals: number[] = []

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

                deficiencies.push(isDeficiency ? 1 : 0);
                shutdowns.push(isShutdown ? 1 : 0);
                functionals.push(isFunctional ? 1 : 0);
            }

            setData({ labels: labels, deficiencies: deficiencies, shutdowns: shutdowns, functionals: functionals });
        })
    }

    useEffect(() => {
        if (selectedBlock !== null && selectedStreet !== null) {
            console.log(selectedBlock)
            console.log(selectedStreet)
            getData();
            setHidden(false);
        } else {
            setHidden(true);
        }
    }, [selectedStreet, selectedBlock])

    const chartData = {
        labels: data?.labels,
        datasets: [
            {
                label: 'Functionare normala',
                data: data?.functionals,
                backgroundColor: '#95ccfc',
                maxBarThickness: 20,
                borderWidth: 1,
                borderColor: 'blue',
            },
            {
                label: 'Deficienta ACC',
                data: data?.deficiencies,
                backgroundColor: '#f7d46a',
                maxBarThickness: 20,
                borderWidth: 1,
                borderColor: 'orange',
            },
            {
                label: 'Oprire ACC',
                data: data?.shutdowns,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                maxBarThickness: 20,
                borderWidth: 1,
                borderColor: 'red',
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
                max: 1,
                ticks: {
                    stepSize: 1,
                    font: {
                        weight: 'normal'
                    }
                }
            }
        },
    };


    return (
        <div style={{ height: 250 }} hidden={hidden}>
            <Bar data={chartData}
                options={options} />
        </div>
    )
}
