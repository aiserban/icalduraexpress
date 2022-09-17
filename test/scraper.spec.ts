import Scraper from '../src/scraping/scraper'
import { expect } from 'chai';  // Using Expect style
var unidecode = require('unidecode')


describe('Scrapper tests', () => {
    const decode = function(data: string[]) {
        for (let i = 0; i < data.length; i++){
            data[i] = unidecode(data[i]);
        }
    }

    it('can filter addresses', async function () {
        const data = [
            '• Str Borşa ',
            '• Str N. Constantinescu',
            '• Bld Prof.dr. Gheorghe Marinescu '
        ]

        decode(data);

        const expected = [
            'Str Borsa',
            'Str N. Constantinescu',
            'Bld Prof.dr. Gheorghe Marinescu'
        ]

        for (let i = 0; i < data.length; i++ ) {
            const actual = await Scraper.filterAddresses(data[i]);
            expect(actual).to.eql(expected[i]);
        }
    })


    it('can get blocks from a list', async function () {
        const data = [
            'Bld Prof.dr. Gheorghe Marinescu - imob.Nr.10, 1',
            'Str Cpt. Alexandru Şerbănescu - bl. 17A, 17B, 18A, 19A, 19B, 19F, 19G',
            'Str G-ral Ştefan Burileanu - bl. 11I, 12J, 12K, 13M, 13N',
            '• Str Cpt. Alexandru Şerbănescu - bl. 14B, SERBANESCU 12-14, 14C, 16A, 16C',
            '• Str Căpâlna - bl. 15M, 14D+14E, 15B, 15J, 15K, 15A, 15L, 16H, 16I'
        ]

        decode(data);

        const expected = [
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
            'Str G-ral Stefan Burileanu - bl. 11I, 12J, 12K, 13M, 13N',
            ''
        ]

        decode(data);

        const expected = [
            'Bld',
            'Str',
            'Cal',
            'Str',
            'Sos',
            'Str',
            undefined
        ]

        for (let i = 0; i < data.length; i++) {
            const actual = await Scraper.getRoadType(data[i]);
            expect(actual).to.eql(expected[i]);
        }
    })
})

