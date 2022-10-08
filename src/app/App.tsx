import React, { useState } from 'react';
import { initChartDefaults } from './chartDefaults';
import { HistoricalDataForBlockChart } from './components/historicalDataForBlockChart.component';
import { HistoricalDataForStreetChart } from './components/historicalDataForStreetChart.component';
import { Search } from './components/search.component';
import { TopBlocksChart } from './components/topBlocksChart.component';


export function App() {
    initChartDefaults();

    const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

    return (
        <div>
            <Search onChangedStreet={street => { setSelectedStreet(street); setSelectedBlock(null); }} />
            <HistoricalDataForStreetChart street={selectedStreet} onClickedBlock={block => { setSelectedBlock(block)}} />
            <HistoricalDataForBlockChart street={selectedStreet} block={selectedBlock} />
            <TopBlocksChart />
        </div>
    )
}