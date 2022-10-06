import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HistoricalDataForStreetChart } from './components/historicalDataForStreetChart.component';
import { Search } from './components/search.component';
import { subDays } from 'date-fns'
import { TopBlocks } from './components/topBlocks.component';
import { AppConfig } from '../../app.config';

export function App() {
    const [selectedStreet, setSelectedStreet] = useState('');

    return (
        <div>
            <Search onChangedStreet={street => { setSelectedStreet(street) }} />
            <HistoricalDataForStreetChart selectedStreet={selectedStreet} />
            <TopBlocks />
        </div>
    )
}