import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from 'react-select';

export default function Search() {
    const [searchInput, setSearchInput] = useState('');
    const [options, setOptions] = useState([{value: '', label: ''}]);

    useEffect(() => {
        axios.get(`http://localhost:3005/api/street/${searchInput}`,).then(res => {
            const matchingStreets = [];
            for (let i=0; i < (res.data as []).length; i++) {
                matchingStreets.push({value: res.data[i].street, label: res.data[i].street})
            }
            setOptions(matchingStreets);
        })
        // }
    }, [searchInput])

    return (
        <>
            <Select placeholder="Introduceti strada..." options={options} onInputChange={input => setSearchInput(input)}></Select>
        </>
    )
}