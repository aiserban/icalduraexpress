import Scraper from '../src/scraping/scraper'
import { assert } from 'chai';  // Using Assert style
import { expect } from 'chai';  // Using Expect style
import { should } from 'chai';  // Using Should style


describe('Scrapper tests', () => {
    it('can split streets from blocks', async function () {
        const data = [
            'Str Borşa - bl. 5F, 4F, 4G, 4E, 7G, ARMONIA, 7B, 7A, 7H',
            'Str N. Constantinescu - bl. 15A, 14, 14A, 16, 16A, 13, 15, imob.Nr.60',
            'Bld Prof.dr. Gheorghe Marinescu - imob.Nr.19, 15'
        ]

        const expected = [
            ['Str Borşa', 'bl. 5F, 4F, 4G, 4E, 7G, ARMONIA, 7B, 7A, 7H'],
            ['Str N. Constantinescu', 'bl. 15A, 14, 14A, 16, 16A, 13, 15, imob.Nr.60'],
            ['Bld Prof.dr. Gheorghe Marinescu', 'imob.Nr.19, 15']
        ]
        const result = await Scraper.splitStreetsAndBlocks(data);

        expect(result).to.be.an('array').and.have.lengthOf(3);
        expect(result).to.eql(expected);
    })

    it('can filter addresses', async function () {
        const data = [
            '• Str Borşa ',
            '• Str N. Constantinescu',
            '• Bld Prof.dr. Gheorghe Marinescu '
        ]

        const expected = [
            'Str Borşa',
            'Str N. Constantinescu',
            'Bld Prof.dr. Gheorghe Marinescu'
        ]

        const result = await Scraper.filterAddresses(data);

        expect(result).to.be.an('array').and.have.lengthOf(3);
        expect(result).to.eql(expected);
    })

    it('can split blocks from a list', async function () {
        const data = [
            'bl. 15M, 14D+14E, 15B, 15J, ARMONIA, 15K, 15A, 15L, 16H, 16I',
            'bl. 2C, 1H, 1 I, 1G, 2K, 2B, 1F, 10G, 10 H ',
            'bl. 8A-2, 8A-3, 2G, 3B, 8C, 2H, 3J, 3I, 8B',
            'bl. 3K, 3F, 8H, 8J, 8G',
            'bl. 8I, 8A-1, 10A, 10I, FELEACU 2',
            'bl. 8, 7, 8A, 7A, imob.Nr.65, 41',
            'Turnescu imobil.Nr.9, 15, 13',
            'imob.Nr.19, 15',
            'bl. 6, 1+1B',
        ]

        const expected = [
            ['15M', '14D', '14E', '15B', '15J', 'ARMONIA', '15K', '15A', '15L', '16H', '16I'],
            ['2C', '1H', '1I', '1G', '2K', '2B', '1F', '10G', '10H'],
            ['8A2', '8A3', '2G', '3B', '8C', '2H', '3J', '3I', '8B'],
            ['3K', '3F', '8H', '8J', '8G'],
            ['8I', '8A1', '10A', '10I', '2'],
            ['8', '7', '8A', '7A', '65', '41'],
            ['9', '15', '13'],
            ['19', '15'],
            ['6', '1', '1B']
        ]

        for (let i = 0; i < data.length; i++) {
            let result = await Scraper.splitBlocks(data[i]);
            expect(result).to.have.members(expected[i]);
        }
    })

    it('can get street type', async function(){
        
    })
})

