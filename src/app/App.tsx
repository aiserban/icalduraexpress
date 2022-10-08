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
    const [topBlocksHidden, setTopBlocksHidden] = useState(false);

    const setTopChartsHidden = (value: boolean) => {
        setTopBlocksHidden(value)
    }

    const onChangedStreet = (street: string | null) => {
        setSelectedStreet(street);
        setSelectedBlock(null);
        if (street !== null) {
            setTopChartsHidden(true)
        } else {
            setTopChartsHidden(false)
        }
    }

    return (
        <div>
            <TopBlocksChart hidden={topBlocksHidden} />
            <Search onChangedStreet={onChangedStreet} />
            <HistoricalDataForStreetChart street={selectedStreet} onClickedBlock={block => { setSelectedBlock(block) }} />
            <HistoricalDataForBlockChart street={selectedStreet} block={selectedBlock} />
        </div>
    )
}