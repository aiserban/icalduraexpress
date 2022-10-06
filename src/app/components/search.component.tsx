import axios from "axios";
import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { AppConfig } from "../../../app.config";
var unidecode = require('unidecode')


export function Search(props: { onChangedStreet: (street: string) => void }) {
    let selectedStreet = '';

    const handleSelect = (street: string) => {
        selectedStreet = street;
        props.onChangedStreet(street);
    }

    const getStreets = async (value: string) => {
        value = unidecode(value);
        return axios.get(`http://${AppConfig.uri}:${AppConfig.port}/api/issue/${value}`).then((res) => {
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