import React, { useState } from 'react';
import { initChartDefaults } from './chartDefaults';
import { HistoricalDataForBlockBar } from './components/historicalDataForBlockBar.component';
import { HistoricalDataForBlockPie } from './components/historicalDataForBlockPie.component';
import { HistoricalDataForStreetBar } from './components/historicalDataForStreetBar.component';
import { Search } from './components/search.component';
import { TopBlocksBar } from './components/topBlocksBar.component';


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
            <TopBlocksBar hidden={topBlocksHidden} />
            <Search onChangedStreet={onChangedStreet} />
            <HistoricalDataForStreetBar street={selectedStreet} onClickedBlock={block => { setSelectedBlock(block) }} />
            <HistoricalDataForBlockPie street={selectedStreet} block={selectedBlock} />
            <HistoricalDataForBlockBar street={selectedStreet} block={selectedBlock} />
        </div>
    )
}