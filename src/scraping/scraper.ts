import { JSDOM } from 'jsdom';

class Scraper {
    url = 'https://www.cmteb.ro/functionare_sistem_termoficare.php';
    data: string = '';
    dom = JSDOM.fromURL(this.url);


    // Locators - {row} should be replaced to the row entry
    rowLoc = '#ST tr:not(:first-of-type)';  // excl headers
    districtLocTemplate = '#ST tr:nth-of-type({row}) td:nth-of-type(1)';
    streetLocTemplate = '#ST tr:nth-of-type({row}) td:nth-of-type(2)';
    issueLocTemplate = '#ST tr:nth-of-type({row}) td:nth-of-type(3)';
    issueDescriptionLocTemplate = '#ST tr:nth-of-type({row}) td:nth-of-type(4)';
    estimatedResolutionLocTemplate = '#ST tr:nth-of-type({row}) td:nth-of-type(5)';

    async getRowCount(): Promise<number> {
        return await this.dom.then(async (dom) => {
            const count = dom.window.document.querySelectorAll(this.rowLoc).length;
            return count;
        })
    }

    // Get all rows
    async getAllRows() {
        return await this.dom.then(async (dom) => {
            const entries = dom.window.document.querySelectorAll(this.rowLoc);
            return entries;
        })
    }

    async filterAddresses(dirtyAddressList: string[]): Promise<string[]> {
        const addresses = [];

        // if it doesn't start with a bullet point, it's not an address
        for (let i = 0; i < dirtyAddressList.length; i++) {
            if (dirtyAddressList[i].startsWith('\u2022')) {     // \u2022 = bullet point
                const cleanAddress = dirtyAddressList[i].replace('\u2022', '').trim()
                addresses.push(cleanAddress);
            }
        }

        return addresses;
    }

    async splitStreetsAndBlocks(streets: string[]) {
        const streetBlockTuples: [[string | undefined, string | undefined]] = [['', '']];   // [0]streets, [1] blocks

        const reBlocks = /(?:-\s)(.*)$/g
        const reStreets = /^(.*)(?:\s-)/g
        for (let i = 0; i < streets.length; i++) {
            let blk = streets[i].match(reBlocks)?.join().replace('-','').trim();
            let st = streets[i].match(reStreets)?.join().replace('-','').trim();
            streetBlockTuples.push([st, blk]);
        }

        streetBlockTuples.shift();
        return streetBlockTuples;
    }

    // TODO Split road type
    async splitBlocks(blocks: string): Promise<string[]> {
        let allBlocks: string[] = [];

        let initialArr = blocks.split(','); // non-trimmed
        let resultArr: string[] = [];

        for (let i = 0; i < initialArr.length; i++) {
            let str = initialArr[i];

            const re = /((?:(\D|(\d+\s|\.))[^\s\/.\r\n]*))\s?$/g
            str = str.match(re)!.join()
                    .replace(/\-/g, '')  // replace all -
                    .replace(/\./g, '')  // replace all .
                    .replace(/\s/g, '')  // replace all whitespace

            if (str.includes('+')) {
                let [a, b] = str.split('+');
                resultArr.push(a,b);
            } else {
                resultArr.push(str);
            }
        }
        
        return resultArr;
    }


    /**
     * Pass a street with a road type and get the road type back
     * @param street format should be "Sos Viilor [...]"
     * @returns road type or undefined
     */
    async getRoadType(street: string): Promise<string | undefined> {
        const re = /^([^\s]+)/g

        const res = street.match(re)?.join();
        return res;
    }

    async parseData() {
        const rows = await this.getAllRows();
        let data = [];

        rows.forEach(async (row) => {
            const district = row.querySelector('td:nth-of-type(1)')?.textContent;
            const issueType = row.querySelector('td:nth-of-type(3)')?.textContent;
            const issueDescription = row.querySelector('td:nth-of-type(4)')?.textContent;
            const resolutionTime = row.querySelector('td:nth-of-type(5)')?.textContent;

            const addressList: string[] = [];
            row.querySelector('td:nth-of-type(2)')?.childNodes.forEach((child) => {     // streets and blocks
                if (child.textContent !== null) {
                    addressList.push(child.textContent);
                }
            });

            const cleanAddresses = await this.filterAddresses(addressList);
            const splitStreets = await this.splitStreetsAndBlocks(cleanAddresses);
        })
    }
}

export default new Scraper();