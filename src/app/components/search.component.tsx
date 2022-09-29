import axios from "axios";
import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
// import Select from 'react-select';
import Async, { useAsync } from 'react-select/async';

export default function Search() {
    const [searchInput, setSearchInput] = useState('');

    const getOptions = async (value: string) => {
        const res = await axios.get(`http://localhost:3005/api/street/${value}`);
        const matchingStreets = [];
        for (let i = 0; i < (res.data as []).length; i++) {
            matchingStreets.push({ value: res.data[i].street, label: res.data[i].street });
        }
        return matchingStreets;
    }

    return (
        <>
            <AsyncSelect cacheOptions placeholder="Introduceti strada..." loadOptions={getOptions} ></AsyncSelect>
        </>
    )
}