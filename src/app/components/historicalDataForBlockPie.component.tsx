import React, { useEffect, useRef, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import axios from 'axios';
import { eachDayOfInterval, format, isSameDay, parseISO, subDays } from 'date-fns';
import { AppConfig } from '../../../app.config';

export function HistoricalDataForBlockPie(props: { labels: string[] | undefined, issueCount: number | undefined, functioningCount: number | undefined}) {
    const data = props;
    const daysAgo = 30;

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Functionare normala',
                data: [data.issueCount, data.functioningCount],
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
        <div id='historicalDataForBlockPie' style={{ width: 500, margin: 'auto' }}>
            <Pie data={chartData} options={options} />
        </div>
    )
}