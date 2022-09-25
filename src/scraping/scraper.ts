import { JSDOM } from 'jsdom';
import Issue from '../data/Issue';
import { parse } from 'date-fns';
import { getNumbersInRange } from '../utils';
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

    async getArrayOfBlocks(address: string) {
        address = unidecode(address);

        const re = /(?:-\s)(.*)$/g
        let blocks = address.match(re)?.join().replace('-', '').trim() || '' // string of blocks
        let blocksArray = blocks.split(','); // non-trimmed

        // If split with semicolons ; split them again
        for (let i = 0; i < blocksArray.length; i++) {
            if (blocksArray[i].includes(';')) {
                const split = blocksArray[i].split(';');
                blocksArray.splice(i, 1, ...split);
            }
        }

        let resultArr: string[] = [];
        for (let i = 0; i < blocksArray.length; i++) {
            let str = blocksArray[i];    // bl.25 OR M20 OR 2C etc

            const institutions = ['gradinita', 'scoala', 'liceu', 'facultate', 'colegiu', 'gimnaziu', 'cresa'];
            const isInstitution = institutions.some(elem => {
                if (str.trim().toLocaleLowerCase().includes(elem)) {
                    return true;
                } else {
                    return false;
                }
            })

            if (!isInstitution) {
                // Remove entrance data if it exists; we need to assume everything after 'sc.' is entrance no
                const indexSc = str.toLocaleLowerCase().indexOf('sc.');
                if (indexSc !== -1) {
                    str = str.slice(0, indexSc).trim();
                }

                // Remove bl. - assume bl. is at the beginning
                const indexBl = str.toLocaleLowerCase().indexOf('bl.');
                if (indexBl !== -1) {
                    str = str.slice(indexBl + 3);
                }

                // Remove nr. - assume nr. is at the beginning
                const indexNr = str.toLocaleLowerCase().indexOf('nr.');
                if (indexNr !== -1) {
                    str = str.slice(indexNr + 3);
                }
            }
            resultArr.push(str.trim());
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
    async scrapData() {
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