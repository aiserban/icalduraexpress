import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { AppConfig } from '../../../app.config';
import { subDays, eachDayOfInterval, parseISO, format } from 'date-fns';
import { isSameDay } from 'date-fns/esm';

export function HistoricalDataForBlockBar(props: { labels: string[] | undefined, deficiencies: number[] | undefined, shutdowns: number[] | undefined, functioning: number[] | undefined }) {
    const data = props;

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
                text: 'Functionare in ultimele zile',
            },
            datalabels: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(ctx: any) {
                        return ctx.dataset.label || ''
                    }
                }
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
                }
            },
            y: {
                stacked: true,
                max: 2,
                ticks: {
                    display: false,
                    font: {
                        weight: 'normal'
                    }
                }
            }
        },
    };


    return (
        <div id='historicalDataForBlockBar' style={{ height: 250 }}>
            <Bar data={chartData}
                options={options} />
        </div>
    )
}
