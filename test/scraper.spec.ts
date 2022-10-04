import { scraper } from '../src/service/scraper'
import { expect } from 'chai';  // Using Expect style
var unidecode = require('unidecode')


describe('Scrapper tests', () => {
    const decode = function (data: string[]) {
        for (let i = 0; i < data.length; i++) {
            data[i] = unidecode(data[i]);
        }
    }

    it('can filter street rows', async () => {
        const data = [
            'Punct termic: ',
            'Modul Termic',
            ' -- 1 blocuri/imobile',
            '',
            '* Cal Vacaresti - Scoala 100',
            '',
            'Punct termic: ',
            '1 Vacaresti',
            ' -- 15 blocuri/imobile',
            '',
            '* Str Pridvorului - bl. 1A, 4, 5, 6',
            '',
            '* Cal Vacaresti - bl. 1B, 1C, 1D, 1E, 2A, 2B, 2C, 3A, 3B, 3C, 3E',
            '',
            'Punct termic: ',
            '4 Tineretului',
            ' -- 23 blocuri/imobile',
            '',
            '• Bld Tineretului - bl. 53, 54, 57, 58, 64, 65, 66',
            '',
            '• Str Baladei - bl. 55, 56, 59, 60, 61, 61A, 73',
            '',
            '• Cal Vacaresti - bl. 62, 63, 67, 68, 71, 72A, 72B',
            '',
            '* Str Caramidarii de Jos - bl. 74A, 74B',
        ]

        const expected = [
            'Cal Vacaresti - Scoala 100',
            'Str Pridvorului - bl. 1A, 4, 5, 6',
            'Cal Vacaresti - bl. 1B, 1C, 1D, 1E, 2A, 2B, 2C, 3A, 3B, 3C, 3E',
            'Bld Tineretului - bl. 53, 54, 57, 58, 64, 65, 66',
            'Str Baladei - bl. 55, 56, 59, 60, 61, 61A, 73',
            'Cal Vacaresti - bl. 62, 63, 67, 68, 71, 72A, 72B',
            'Str Caramidarii de Jos - bl. 74A, 74B',
        ]

        for(let i = 0; i < data.length; i++) {
            const actual = await scraper.getOnlyAddressStrings(data[i]);
            if (actual) {
                expect(expected).to.include(actual);
            }
        }
    })

    it('can get the streetname', async () => {
        const data = [
            'Şos Virtuţii - bl. G3, R6A 3+4, R6A 1+2',
            'Bld Prof.dr. Gheorghe Marinescu - imob.Nr.10, 1',
            'Str Constantin Rădulescu-Motru - bl. 21, 27A, 28, 34',
            'Ale G-ral Jean-Louis Calderon - bl. 10',
            '• Str Cpt. Alexandru Şerbănescu - bl. 14B'
        ]

        const expected = [
            'Virtutii',
            'Prof.dr. Gheorghe Marinescu',
            'Constantin Radulescu-Motru',
            'G-ral Jean-Louis Calderon',
            'Cpt. Alexandru Serbanescu'
        ]

        for (let i = 0; i < data.length; i++) {
            const actual = await scraper.getStreetNameFromFullAdress(data[i]);
            expect(actual).to.eql(expected[i]);
        }
    })

    it('can get blocks from a list', async function () {
        const data = [
            '• Şos Virtuţii - bl. G3, R6A 3+4, R6A 1+2',
            'Bld Prof.dr. Gheorghe Marinescu - imob.Nr.10, 1',
            'Str Cpt. Alexandru Şerbănescu - bl. 17A, 17B, 18A, 19A, 19B, 19F, 19G',
            'Str G-ral Ştefan Burileanu - bl. 11I, 12J, 12K, 13M, 13N, 20-I',
            '• Str Cpt. Alexandru Şerbănescu - bl. 14B, SERBANESCU 12-14, 14C, 16A, 16C',
            '• Str Căpâlna - bl. 15M, 14D+14E, 16I',
            '• Ale Ilia - bl. 56; Pelican; 58C; 58A; 57 sc.2',
            '• Str Smaranda Brăescu - bl. 20H, 20F, 21 I, 21F',
            '• Str Johannes K. Kepler - bl.K/4/1; 2',
            '• Bld Alexandru Obregia - bl. 18A, 20Bis, A15, R3, R13, II/30, II/31',
            '• Ale Adrian Dan Urucu - bl. 20, Gradinita nr.227',
            '• Str Jean-Alexandru Steriadi - bl. G4, I18bis, I23, I24',
            '• Cal Griviţei - bl.4',
            '• Str Jiului - ',
            '• Str Băiculeşti - bl .A3'
        ]

        const expected = [
            ['G3', 'R6A 3+4', 'R6A 1+2'],
            ['imob.Nr.10', '1'],
            ['17A', '17B', '18A', '19A', '19B', '19F', '19G'],
            ['11I', '12J', '12K', '13M', '13N', '20-I'],
            ['14B', 'SERBANESCU 12-14', '14C', '16A', '16C'],
            ['15M', '14D+14E', '16I'],
            ['56', 'Pelican', '58C', '58A', '57'],
            ['20H', '20F', '21 I', '21F'],
            ['K/4/1', '2'],
            ['18A', '20Bis', 'A15', 'R3', 'R13', 'II/30', 'II/31'],
            ['20', 'Gradinita nr.227'],
            ['G4', 'I18bis', 'I23', 'I24'],
            ['4'],
            ['N/A'],
            ['A3']
        ]

        for (let i = 0; i < data.length; i++) {
            let actual = await scraper.getArrayOfBlocksFromFullAddress(data[i]);
            expect(actual).to.have.members(expected[i]);
        }
    })

    it('can get road type', async function () {
        const data = [
            'Bld G-ral Gheorghe Magheru',
            'Str N. Constantinescu',
            '• Cal Dorobanţilor',
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
            const actual = await scraper.getRoadType(data[i]);
            expect(actual).to.eql(expected[i]);
        }
    })
})

