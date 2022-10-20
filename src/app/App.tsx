import React, { useState } from 'react';
import { initChartDefaults } from './chartDefaults';
import { HistoricalDataForBlockBar } from './components/historicalDataForBlockBar.component';
import { HistoricalDataForBlockPie } from './components/historicalDataForBlockPie.component';
import { HistoricalDataForBlockSection } from './components/historicalDataForBlockSection.component';
import { HistoricalDataForStreetBar } from './components/historicalDataForStreetBar.component';
import { Search } from './components/search.component';
import { TopBlocksBar } from './components/topBlocksBar.component';


export function App() {
    initChartDefaults();

    const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
    const [topBlocksHidden, setTopBlocksHidden] = useState(false);
    const [historicalDataForStreetHidden, sethistoricalDataForStreetHidden] = useState(true);

    const setTopChartsHidden = (value: boolean) => {
        setTopBlocksHidden(value)
    }

    const onChangedStreet = (street: string | null) => {
        setSelectedStreet(street);
        setSelectedBlock(null);
        if (street !== null) {
            setTopChartsHidden(true)
            sethistoricalDataForStreetHidden(false);
        } else {
            setTopChartsHidden(false)
        }
    }

    return (
        <div>
            <TopBlocksBar hidden={topBlocksHidden}
                onClicked={(street, block) => {setSelectedStreet(street); setSelectedBlock(block); sethistoricalDataForStreetHidden(true)}}/>
            <Search onChangedStreet={onChangedStreet} />
            <HistoricalDataForStreetBar
                hidden={historicalDataForStreetHidden}
                street={selectedStreet}
                onClickedBlock={block => { setSelectedBlock(block) }} />
            <HistoricalDataForBlockSection street={selectedStreet} block={selectedBlock} />
        </div>
    )
}