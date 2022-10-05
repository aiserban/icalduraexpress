import axios from "axios";
import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
var unidecode = require('unidecode')


export function Search(props: { onChangedStreet: (street: string) => void }) {
    const ip = '192.168.0.174';
    const port = '3005';
    let selectedStreet = '';

    const handleSelect = (street: string) => {
        selectedStreet = street;
        props.onChangedStreet(street);
    }

    const getStreets = async (value: string) => {
        value = unidecode(value);
        return axios.get(`http://${ip}:${port}/api/issue/${value}`).then((res) => {
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
        <>
            <AsyncSelect
                cacheOptions
                placeholder="Introduceti strada..."
                loadOptions={getStreets}
                onChange={(event) => { handleSelect(event!.value) }} />
        </>
    )
}