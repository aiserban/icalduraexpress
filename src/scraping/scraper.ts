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

    async cleanupAddresses(dirtyAddressList: string[]): Promise<string[]> {
        const addresses = [];
        const garbage = [];     // TODO remove this, only for debug

        for (let i = 0; i < dirtyAddressList.length; i++) {
            if (dirtyAddressList[i].startsWith('\u2022')) {     // \u2022 = bullet point
                addresses.push(dirtyAddressList[i].replace('\u2022', '').trim());
            } else {
                garbage.push(dirtyAddressList[i]);  // TODO remove this too
            }
        }

        return addresses;
    }

    async splitStreetsAndBlocks(streets: string[]) {

        const result: [[string, string]] = [['','']];
        for (let i = 0; i < streets.length; i++){
            const tmp = streets[i].split(' - ');
            let tuple: [string, string] = [tmp[0], tmp[1]];

            result.push(tuple);
        }

        result.shift();
        return result;
    }

    // TODO Split blocks
    // TODO Split road type
    

    async parseData() {
        const rows = await this.getAllRows();
        let data = [];

        rows.forEach(async (row) => {
            const district = row.querySelector('td:nth-of-type(1)')?.textContent;
            const issueType = row.querySelector('td:nth-of-type(3)')?.textContent;
            const issueDescription = row.querySelector('td:nth-of-type(4)')?.textContent;
            const resolutionTime = row.querySelector('td:nth-of-type(5)')?.textContent;

            const addressList: string[] = [];
            row.querySelector('td:nth-of-type(2)')?.childNodes.forEach((child) => {
                if (child.textContent !== null) {
                    addressList.push(child.textContent);
                }
            });

            const cleanAddresses = await this.cleanupAddresses(addressList);
            const splitStreets = await this.splitStreetsAndBlocks(cleanAddresses);
        })
    }
}

export default new Scraper();