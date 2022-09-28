import React, { useState, useRef } from "react";
import Select from "react-select";

export default function Search() {
    const [searchInput, setSearchInput] = useState('abc');
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]
    return (
        <>
            <Select options={options}></Select>
        </>
    )
}