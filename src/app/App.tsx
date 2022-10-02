import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MostAffectedBlocks from './components/mostAffectedBlocks.component';
import Search from './components/search.component';
import { subDays } from 'date-fns'

export default function App() {
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
        axios.get(`http://localhost:3005/api/issue/${state.selectedStreet}/all/${from}`).then((res) => {
            const incomingData = (res.data as [{ block: string, datesAdded: Date[] }]);
            const newState = {
                ...state,
                data: {
                    mostAffectedBlocks: {
                        labels: incomingData.map(item => { return item.block }),
                        issueCount: incomingData.map(item => { return item.datesAdded.length }),
                        noIssueCount: incomingData.map(item => { return daysAgo - item.datesAdded.length })
                    }
                }
            }

            setState(newState);
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
