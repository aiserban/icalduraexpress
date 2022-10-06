import React, { useState } from 'react';
import { initChartDefaults } from './chartDefaults';
import { HistoricalDataForStreetChart } from './components/historicalDataForStreetChart.component';
import { Search } from './components/search.component';
import { TopBlocksChart } from './components/topBlocksChart.component';


export function App() {
    initChartDefaults();

    const [selectedStreet, setSelectedStreet] = useState('');

    return (
        <div>
            <Search onChangedStreet={street => { setSelectedStreet(street) }} />
            <HistoricalDataForStreetChart selectedStreet={selectedStreet} />
            <TopBlocksChart />
        </div>
    )
}