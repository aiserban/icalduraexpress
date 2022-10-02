import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MostAffectedBlocks from './components/mostAffectedBlocks.component';
import Search from './components/search.component';
import { subDays } from 'date-fns'

export default function App() {
    const [state, setState] = useState({
        selectedStreet: '',
        data: {
            labels: ['A', 'b', 'b', 'x'],
            mostAffectedBlocks: [4, 4, 4, 4, 4, 4, 4, 4, 4]
        }
    })

    const getChartData = async () => {
        const from = subDays(new Date(), 90);
        axios.get(`http://localhost:3005/api/issue/${state.selectedStreet}/all/${from}`).then((res) => {
            const incomingData = (res.data as [{ block: string, datesAdded: Date[] }]);
            const newState = {
                ...state,
                data: {
                    labels: incomingData.map(item => { return item.block }),
                    mostAffectedBlocks: incomingData.map(item => { return item.datesAdded.length })
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
            <MostAffectedBlocks labels={state.data.labels} data={state.data.mostAffectedBlocks} />
        </div>
    )
}
