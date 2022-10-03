import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MostAffectedBlocks } from './components/mostAffectedBlocks.component';
import { Search } from './components/search.component';
import { subDays } from 'date-fns'

export function App() {
    const ip = '192.168.0.174';
    const port = '3005';
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

    const getChartData = async () => {
        const daysAgo = 90;
        const from = subDays(new Date(), daysAgo);
        axios.get(`http://${ip}:${port}/api/issue/${state.selectedStreet}/all/${from}`).then((res) => {
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
        console.log(state);
    }, [state])

    const onChangedStreetCallback = (street: string) => {
        state.selectedStreet = street;
        console.log(street);
        getChartData();
    }

    return (
        <div>
            <Search onChangedStreet={onChangedStreetCallback} />
            <MostAffectedBlocks labels={state.data.mostAffectedBlocks.labels}
                issueCount={state.data.mostAffectedBlocks.issueCount}
                noIssueCount={state.data.mostAffectedBlocks.noIssueCount} />
        </div>
    )
}