import axios from "axios";

async function scrapper() {
    const url = 'https://www.cmteb.ro/functionare_sistem_termoficare.php';
    return await axios.get(url).then(async (res) =>{
        return res.data;
    })
}

export default scrapper;