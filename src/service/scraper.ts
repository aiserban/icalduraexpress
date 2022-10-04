import { JSDOM } from 'jsdom';
import { Issue } from './data/Issue';
import { add, parse } from 'date-fns';
import { getNumbersInRange } from '../utils';
import { roadTypeMappings } from './enums';
var unidecode = require('unidecode')

class Scraper {
    url = 'https://www.cmteb.ro/functionare_sistem_termoficare.php';
    data: string = '';
    // dom: JSDOM | void | undefined;


    // Locators - {row} should be replaced to the row entry
    rowLoc = '#ST tr:not(:first-of-type)';  // excl headers
    districtLocTemplate = '#ST tr:nth-of-type({row}) td:nth-of-type(1)';
    streetLocTemplate = '#ST tr:nth-of-type({row}) td:nth-of-type(2)';
    issueLocTemplate = '#ST tr:nth-of-type({row}) td:nth-of-type(3)';
    issueDescriptionLocTemplate = '#ST tr:nth-of-type({row}) td:nth-of-type(4)';
    estimatedResolutionLocTemplate = '#ST tr:nth-of-type({row}) td:nth-of-type(5)';

    // Get all rows
    async getAllRows(dom: JSDOM) {
        const entries = dom.window.document.querySelectorAll(this.rowLoc);
        return entries;
    }

    async getOnlyAddressStrings(address: string): Promise<string | void> {
        address = unidecode(address);

        if (address.startsWith('*')) {        // if it doesn't start with a * , it's not an address
            return address.replace('*', '').trim();
        }
    }

    /**
     * Get the street name, like 'Virtutii', from a full address string
     * @param address Full address string
     * e.g. 'Str G-Ral Radulescu - bl. 58
     * @returns just the name of the street, without the road type
     */
    async getStreetNameFromFullAdress(address: string): Promise<string> {
        address = unidecode(address);
        address = address.replace('*', '').trim();

        let result = ''

        const re = /(\s.+)(?:\s-)/g
        try {
            result = address.match(re)?.join().trim().slice(0, result?.lastIndexOf('-')).trim() || ''
        } catch (err) {
            console.log(err);
        }

        return result;
    }

    /**
     *
     * @param address full address string
     * @returns the list of blocks
     */
    async getArrayOfBlocksFromFullAddress(address: string) {
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

            const institutions = ['gradinita', 'scoala', 'liceu', 'facultate', 'colegiu', 'gimnaziu', 'cresa', 'policlinica', 'spital', 'biserica'];
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
                if (str.toLocaleLowerCase().startsWith('bl.')) {
                    str = str.replace('bl.', '');
                } else if (str.toLocaleLowerCase().startsWith('bl .')) {
                    str = str.replace('bl .', '')
                } else if (str.toLocaleLowerCase().startsWith('bl')) {
                    str = str.replace('bl', '')
                }
            }

            if (str.trim() !== '') {
                resultArr.push(str.trim());
            }
        }

        if (resultArr.length === 0) {
            resultArr.push('N/A');
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
        if(street.startsWith('*')) {
            street = street.replace('*', '').trim();
        }

        // const re = /^([^\s]+)/g
        const re = /^(?:•|\s|)(?:\s+|)(\w+-?\w+)/g

        const res = street.match(re)?.join();
        return res;
    }


    /**
     * Where the magic happens
     */
    async scrapData(): Promise<Issue[] | void> {
        const issueArr: Issue[] = [];

        const dom = await JSDOM.fromURL(this.url).then(res => {
            return res;
        }).catch(err => {
            console.log(err);
            return;
        })

        if (dom === undefined) {
            return;
        }

        const rows = await this.getAllRows(dom);

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
                const address = await this.getOnlyAddressStrings(addressList[i]);
                // const address = addressList[i];

                if (address) {
                    const blocks = await this.getArrayOfBlocksFromFullAddress(address) || '';
                    const streetName = await this.getStreetNameFromFullAdress(address) || '';
                    const roadType = roadTypeMappings[await this.getRoadType(address) || ''];
                    const street = `${roadType} ${streetName}` || '';

                    const issue = new Issue(
                        district,
                        roadType,
                        streetName,
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

export const scraper = new Scraper();