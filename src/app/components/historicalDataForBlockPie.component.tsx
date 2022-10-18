import React, { useEffect, useRef, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import axios from 'axios';
import { eachDayOfInterval, format, isSameDay, parseISO, subDays } from 'date-fns';
import { AppConfig } from '../../../app.config';

export function HistoricalDataForBlockPie(props: { street: string | null, block: string | null }) {
    const [data, setData] = useState<{ labels: ['Avarii', 'Functionare normala'], issues: number, functioning: number }>();
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

            let issues = 0;
            let functioning = 0;

            for (const day of interval) {
                let issueAdded = false;
                for (const result of results) {
                    if (isSameDay(day, result.dateAdded) && (result.issueType === 'Deficienta ACC' || result.issueType === 'Oprire ACC')) {
                        issues += 1;
                        issueAdded = true;
                    }
                }

                if (!issueAdded) {
                    functioning += 1;
                }
            }

            setData({ labels: ['Avarii', 'Functionare normala'], issues: issues, functioning: functioning });
        })
    }

    useEffect(() => {
        if (selectedBlock !== null && selectedStreet !== null) {
            setHidden(false);
            getData().then(() => {
                document.getElementById('historicalDataForBlockPie')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
                data: [data?.issues, data?.functioning],
                backgroundColor: ['rgba(255, 99, 132, 0.5)', '#95ccfc'],
                borderWidth: 1,
                // maxBarThickness: 20,
                // borderColor: 'blue',
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'center' as const,
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                },
            },
            title: {
                display: true,
                text: `Status in ultimele ${daysAgo} zile`
            },
            datalabels: {
                display: true,
                font: {
                    weight: 'bold' as const
                },
                anchor: 'center' as const,
                align: 'top' as const,
            }
        }
    }


    return (
        <div id='historicalDataForBlockPie' hidden={hidden} style={{ width: 500, margin: 'auto' }}>
            <Pie data={chartData} options={options} />
        </div>
    )
}