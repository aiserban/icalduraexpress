import { JSDOM } from 'jsdom';
import Issue from '../data/Issue';
import { parse } from 'date-fns';
import { getNumbersInRange } from '../helpers';
var unidecode = require('unidecode')

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

    async filterAddresses(address: string): Promise<string | undefined> {
        address = unidecode(address);

        if (address.startsWith('*')) {        // if it doesn't start with a * , it's not an address
            return address.replace('*', '').trim();
        }
        return undefined
    }

    async getStreetName(address: string): Promise<string | undefined> {
        address = unidecode(address);

        const re = /(\s.+)(?:\s-\s)/g
        return address.match(re)?.join().trim().replaceAll('-', '').trim();
    }


    // TODO • Şos Pantelimon - bl. 52, 61, 68, 65, 69A, 62, 51, 67, *** 69P+6 ***
    // • Str Gen. Andrei Popovici - bl. 6, 1+1B << this will get broken
    async getArrayOfBlocks(address: string) {
        address = unidecode(address);

        const re = /(?:-\s)(.*)$/g
        let blocks = address.match(re)?.join().replace('-', '').trim() || '' // string of blocks

        let initialArr = blocks.split(','); // non-trimmed
        let resultArr: string[] = [];

        for (let i = 0; i < initialArr.length; i++) {
            let str = initialArr[i];    // bl.25 OR M20 OR 2C etc

            if (str.includes('-')) {    // could be a range...
                if (str.toLowerCase().includes('bl.') || str.toLowerCase().includes('nr.')){
                    str = str.replace('bl.', '').replace('nr.', '').trim();
                }

                const [leftSide, rightSide] = str.trim().split('-');
                if (Number(leftSide) && Number(rightSide)) {    // we can assume it's a range of blocks
                    getNumbersInRange(Number.parseInt(leftSide), Number.parseInt(rightSide))
                                        .map((int) => initialArr.push(int.toString()));
                    continue;
                }
            }

            const re = /((?:(\D|(\d+\s|\.))[^\s\/.\r\n]*))\s?$/g
            str = str.match(re)?.join()
                // .replace(/\-/g, '')         // replace all -
                .replace(/\./g, '')         // replace all .
                .replace(/\s/g, '') || str  // replace all whitespace

            if (str.includes('+')) {
                let [a, b] = str.split('+');
                resultArr.push(a, b);
            } else if (str.includes('-')) {
                let [a, b] = str.split('-');
                resultArr.push(a, b);
            } else {
                resultArr.push(str)
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
        street = unidecode(street)

        // const re = /^([^\s]+)/g
        const re = /^(?:•|\s|)(?:\s+|)(\w+-?\w+)/g

        const res = street.match(re)?.join();
        return res;
    }


    /**
     * Where the magic happens
     */
    async parseData() {
        this.dom = JSDOM.fromURL(this.url);
        const rows = await this.getAllRows();
        const issueArr: Issue[] = [];

        for (let i = 0; i < rows.length; i++) {
            const district = rows[i].querySelector('td:nth-of-type(1)')?.textContent || '';
            const issueType = unidecode(rows[i].querySelector('td:nth-of-type(3)')?.textContent || '');
            const description = unidecode(rows[i].querySelector('td:nth-of-type(4)')?.textContent || '');
            const resolutionTime = parse(rows[i].querySelector('td:nth-of-type(5)')?.textContent || '', "dd.MM.yyyy HH:mm", new Date());

            const addressList: string[] = [];
            rows[i].querySelector('td:nth-of-type(2)')?.childNodes.forEach((child) => {     // streets and blocks
                if (child.textContent !== null) {
                    addressList.push(unidecode(child.textContent));
                }
            });


            for (let i = 0; i < addressList.length; i++) {
                const cleanAddress = await this.filterAddresses(addressList[i]);

                if (cleanAddress) {
                    const blocks = await this.getArrayOfBlocks(cleanAddress) || '';
                    const street = await this.getStreetName(cleanAddress) || '';
                    const roadType = await this.getRoadType(cleanAddress) || '';

                    const issue = new Issue(
                        district,
                        roadType,
                        street,
                        blocks,
                        issueType,
                        description,
                        resolutionTime,
                        new Date()
                    )

                    issueArr.push(issue);
                }

            }
        }

        return issueArr;
    }
}

export default new Scraper();