import axios from "axios";
import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
// import Select from 'react-select';
import Async, { useAsync } from 'react-select/async';

export default function Search() {
    const [searchInput, setSearchInput] = useState('');

    const getOptions = async (value: string) => {
        const distinct = true;
        const res = await axios.get(`http://localhost:3005/api/street/${value}/${distinct}`);

        const matchingStreets = [];
        if (distinct === true) {
            for (let i = 0; i < (res.data as []).length; i++) {
                console.log('Log ' + res.data[i]);
                matchingStreets.push({ value: res.data[i], label: res.data[i] });
            }
        } else if (distinct === false) {
            for (let i = 0; i < (res.data as []).length; i++) {
                console.log('Log ' + res.data[i]);
                matchingStreets.push({ value: res.data[i].street, label: res.data[i].street });
            }
        }

        return matchingStreets;
    }

    return (
        <>
            <AsyncSelect cacheOptions defaultOptions={[]} placeholder="Introduceti strada..." loadOptions={getOptions} ></AsyncSelect>
        </>
    )
}