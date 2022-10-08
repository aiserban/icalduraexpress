import axios from "axios";
import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { AppConfig } from "../../../app.config";
var unidecode = require('unidecode')


export function Search(props: { onChangedStreet: (street: string | null) => void }) {
    let selectedStreet = '';

    const handleSelect = (event: {value: string, label: string} | null) => {
        if (event !== null){
            props.onChangedStreet(event.value);
        } else {
            props.onChangedStreet(null);
        }
    }

    const getStreets = async (input: string): Promise<{ value: string, label: string }[]> => {
        if (input === undefined || input.length < 3) {
            return []
        }

        input = unidecode(input);
        return axios.get(`http://${AppConfig.uri}:${AppConfig.port}/api/issue/${input}`).then((res) => {
            const matchingStreets = (res.data as [{ roadType: string, streetName: string, street: string }])
                .map((street) => {
                    return { value: street.street, label: street.street }
                })
            return matchingStreets;
        }).catch((err) => {
            console.log(err);
            return [{ value: 'err', label: 'err' }]
        })
    }

    return (
        <div id='search'>
            <AsyncSelect
                cacheOptions
                placeholder="Introduceti minim 3 caractere pentru a cauta dupa strada..."
                isClearable={true}
                loadOptions={getStreets}
                onChange={event => { handleSelect(event) }} />
        </div>
    )
}