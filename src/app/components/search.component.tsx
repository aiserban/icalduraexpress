import React, { useState, useRef } from "react";

export default function Search() {
    const [searchInput, setSearchInput] = useState('abc');

    return (
        <>
            <input placeholder="Street name" autoComplete="none" value={searchInput} onInput={event => setSearchInput((event.target as HTMLInputElement).value)}></input>
        </>
    )
}