import Scraper from '../src/scraping/scraper.js'
import { assert } from 'chai';  // Using Assert style
import { expect } from 'chai';  // Using Expect style
import { should } from 'chai';  // Using Should style


describe('Scrapper tests', () => {
    it('Streets can be split from blocks', async () => {
        const data = [
            '• Str Borşa - bl. 5F, 4F, 4G, 4E, 7G, ARMONIA, 7B, 7A, 7H',
            '• Str N. Constantinescu - bl. 15A, 14, 14A, 16, 16A, 13, 15, imob.Nr.60',
            '• Bld Prof.dr. Gheorghe Marinescu - imob.Nr.19, 15'
        ]

        const expected = [
            ['• Str Borşa', 'bl. 5F, 4F, 4G, 4E, 7G, ARMONIA, 7B, 7A, 7H'],
            ['• Str N. Constantinescu', 'bl. 15A, 14, 14A, 16, 16A, 13, 15, imob.Nr.60'],
            ['• Bld Prof.dr. Gheorghe Marinescu', 'imob.Nr.19, 15']
        ]
        const result = await Scraper.splitStreetsAndBlocks(data);

        expect(result).to.be.an('array').and.have.lengthOf(3);
        expect(result).to.eql(expected);
    })
})

