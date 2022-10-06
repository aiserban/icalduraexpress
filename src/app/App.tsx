import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HistoricalDataForStreetChart } from './components/historicalDataForStreetChart.component';
import { Search } from './components/search.component';
import { subDays } from 'date-fns'
import { TopBlocks } from './components/topBlocks.component';
import { AppConfig } from '../../app.config';

export function App() {
    const [state, setState] = useState({
        selectedStreet: '',
        data: {
            mostAffectedBlocks: {
                labels: ['A', 'b', 'b', 'x'],
                issueCount: [4, 4, 4, 4, 4, 4, 4, 4, 4],
                noIssueCount: [4, 4, 4, 4, 4, 4, 4, 4, 4],
            }
        }
    })

    const getHistoricalDataForStreet = () => {
        const daysAgo = 90;
        const from = subDays(new Date(), daysAgo);
        axios.get(`http://${AppConfig.uri}:${AppConfig.port}/api/issue/${state.selectedStreet}/all/${from}`).then((res) => {
            const incomingData = (res.data as [{ block: string, issueCount: number, noIssueCount: number }]);
            const newState = {
                ...state,
                data: {
                    mostAffectedBlocks: {
                        labels: incomingData.map(item => { return item.block }),
                        issueCount: incomingData.map(item => { return item.issueCount }),
                        noIssueCount: incomingData.map(item => { return item.noIssueCount })
                    }
                }
            }

            setState(newState);
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
    }, [state])

    const onChangedStreetCallback = (street: string) => {
        state.selectedStreet = street;
        getHistoricalDataForStreet();
    }

    return (
        <div>
            <Search onChangedStreet={onChangedStreetCallback} />
            <HistoricalDataForStreetChart
                labels={state.data.mostAffectedBlocks.labels}
                issueCount={state.data.mostAffectedBlocks.issueCount}
                noIssueCount={state.data.mostAffectedBlocks.noIssueCount} />
            <TopBlocks />
        </div>
    )
}