import Scraper from '../src/scraping/scraper'
import { assert } from 'chai';  // Using Assert style
import { expect } from 'chai';  // Using Expect style
import { should } from 'chai';  // Using Should style


describe('Scrapper tests', () => {

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

        for (let i = 0; i < data.length; i++ ) {
            const actual = await Scraper.filterAddresses(data[i]);
            expect(actual).to.eql(expected[i]);
        }
    })


    // it('can split streets from blocks', async function () {
    //     const data = [
    //         'Str Borşa - bl. 5F, 4F, 4G, 4E, 7G, ARMONIA, 7B, 7A, 7H',
    //         'Str N. Constantinescu - bl. 15A, 14, 14A, 16, 16A, 13, 15, imob.Nr.60',
    //         'Bld Prof.dr. Gheorghe Marinescu - imob.Nr.19, 15'
    //     ]

    //     const expected = [
    //         ['Str Borşa', 'bl. 5F, 4F, 4G, 4E, 7G, ARMONIA, 7B, 7A, 7H'],
    //         ['Str N. Constantinescu', 'bl. 15A, 14, 14A, 16, 16A, 13, 15, imob.Nr.60'],
    //         ['Bld Prof.dr. Gheorghe Marinescu', 'imob.Nr.19, 15']
    //     ]
    //     const actual = await Scraper.splitStreetsAndBlocks(data);

    //     expect(actual).to.be.an('array').and.have.lengthOf(3);
    //     expect(actual).to.eql(expected);
    // })


    it('can get blocks from a list', async function () {
        const data = [
            'Bld Prof.dr. Gheorghe Marinescu - imob.Nr.10, 1',
            'Str Cpt. Alexandru Şerbănescu - bl. 17A, 17B, 18A, 19A, 19B, 19F, 19G',
            'Str G-ral Ştefan Burileanu - bl. 11I, 12J, 12K, 13M, 13N',
            '• Str Cpt. Alexandru Şerbănescu - bl. 14B, SERBANESCU 12-14, 14C, 16A, 16C',
            '• Str Căpâlna - bl. 15M, 14D+14E, 15B, 15J, 15K, 15A, 15L, 16H, 16I'
        ]

        const expected = [
            // ['20', '2'],
            ['10','1'],
            ['17A', '17B', '18A', '19A', '19B', '19F', '19G'],
            ['11I', '12J', '12K', '13M', '13N'],
            ['14B', '12', '14', '14C', '16A', '16C'],
            ['15M', '14D', '14E', '15B', '15J', '15K', '15A', '15L', '16H', '16I']
        ]

        for (let i = 0; i < data.length; i++) {
            let actual = await Scraper.getArrayOfBlocks(data[i]);
            expect(actual).to.have.members(expected[i]);
        }
    })

    it('can get street type', async function () {
        const data = [
            'Bld G-ral Gheorghe Magheru',
            'Str N. Constantinescu',
            'Cal Dorobanţilor',
            'Str George Enescu',
            'Şos Viilor',
            ''
        ]

        const expected = [
            'Bld',
            'Str',
            'Cal',
            'Str',
            'Şos',
            undefined
        ]

        for (let i = 0; i < data.length; i++) {
            const actual = await Scraper.getRoadType(data[i]);
            expect(actual).to.eql(expected[i]);
        }
    })
})

