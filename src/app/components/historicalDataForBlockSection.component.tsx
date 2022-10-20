import axios from 'axios';
import { subDays, parseISO, eachDayOfInterval, isSameDay, format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { AppConfig } from '../../../app.config';
import { HistoricalDataForBlockBar } from './historicalDataForBlockBar.component';
import { HistoricalDataForBlockPie } from './historicalDataForBlockPie.component';

export function HistoricalDataForBlockSection(props: { street: string | null, block: string | null }) {
    const [pieData, setPieData] = useState<{ labels: ['Avarii', 'Functionare normala'], issues: number, functioning: number } | undefined>();
    const [barData, setBarData] = useState<{ labels: string[], deficiencies: number[], shutdowns: number[], functioning: number[] } | undefined>();
    const [hidden, setHidden] = useState(true);
    let selectedStreet = props.street;
    let selectedBlock = props.block;
    const daysAgo = 30;

    const getData = async () => {
        const from = subDays(new Date(), daysAgo - 1);
        return axios.get(`http://${AppConfig.uri}:${AppConfig.port}/api/issue/${selectedStreet}/${selectedBlock}/${from}`).then(res => {
            const results = (res.data as [{ dateAdded: string, issueType: string }])
                .map(item => { return { dateAdded: parseISO(item.dateAdded), issueType: item.issueType } });

            const interval = eachDayOfInterval({ start: from, end: new Date() });
            const labels = interval.map(day => format(day, 'dd-MM-yyyy'));
            const deficiencies: number[] = []
            const shutdowns: number[] = []
            const functioning: number[] = []
            let issueCount = 0;
            let functioningCount = 0;

            // Pie data
            for (const day of interval) {
                let issueAdded = false;
                for (const result of results) {
                    if (isSameDay(day, result.dateAdded) && (result.issueType === 'Deficienta ACC' || result.issueType === 'Oprire ACC')) {
                        issueCount += 1;
                        issueAdded = true;
                    }
                }

                if (!issueAdded) {
                    functioningCount += 1;
                }
            }

            setPieData({ labels: ['Avarii', 'Functionare normala'], issues: issueCount, functioning: functioningCount });

            // Bar data
            for (const day of interval) {
                let isDeficiency = false;
                let isShutdown = false;

                for (const result of results) {
                    if (isSameDay(day, result.dateAdded) && result.issueType === 'Deficienta ACC') {
                        isDeficiency = true;
                    }
                    if (isSameDay(day, result.dateAdded) && result.issueType === 'Oprire ACC') {
                        isShutdown = true;
                    }
                }

                if (isDeficiency && isShutdown) {
                    deficiencies.push(1);
                    shutdowns.push(1);
                    functioning.push(0)
                } else if (isDeficiency && !isShutdown) {
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

            setBarData({ labels: labels, deficiencies: deficiencies, shutdowns: shutdowns, functioning: functioning });
        })
    }

    useEffect(() => {
        if (selectedBlock !== null && selectedStreet !== null) {
            setHidden(false);
            getData().then(() => {
                setTimeout(() => {
                    document.getElementById('historicalDataForBlockBar')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 50);     // need to wait for a bit for chart to be rendered and element made visible
            })
        } else {
            setHidden(true);
        }
    }, [selectedStreet, selectedBlock])

    return (
        <div hidden={hidden}>
            <HistoricalDataForBlockPie labels={pieData?.labels} issueCount={pieData?.issues} functioningCount={pieData?.functioning} />
            <HistoricalDataForBlockBar labels={barData?.labels} deficiencies={barData?.deficiencies} shutdowns={barData?.shutdowns} functioning={barData?.functioning} />
            {/* <HistoricalDataForBlockBar /> */}
        </div>
    )
}