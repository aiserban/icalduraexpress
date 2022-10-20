import axios from 'axios';
import { subDays, parseISO, eachDayOfInterval, isSameDay } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { AppConfig } from '../../../app.config';
import { HistoricalDataForBlockBar } from './historicalDataForBlockBar.component';
import { HistoricalDataForBlockPie } from './historicalDataForBlockPie.component';

export function HistoricalDataForBlockSection(props: {street: string | null, block: string | null}) {
    const [pieData, setPieData] = useState<{ labels: ['Avarii', 'Functionare normala'], issues: number, functioning: number } | undefined>(undefined);
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

            setPieData({ labels: ['Avarii', 'Functionare normala'], issues: issues, functioning: functioning });
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

    return (
        <div hidden={hidden}>
            <HistoricalDataForBlockPie labels={pieData?.labels} issueCount={pieData?.issues} functioningCount={pieData?.functioning}/>
            {/* <HistoricalDataForBlockBar /> */}
        </div>
    )
}