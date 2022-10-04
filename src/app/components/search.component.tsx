import axios from "axios";
import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";

export function Search(props: { onChangedStreet: (street: string) => void }) {
    const ip = '192.168.0.174';
    const port = '3005';
    let selectedStreet = '';

    const handleSelect = (street: string) => {
        selectedStreet = street;
        props.onChangedStreet(street);
    }

    const getStreets = async (value: string) => {
        return axios.get(`http://${ip}:${port}/api/issue/${value}`).then((res) => {
            const matchingStreets = (res.data as [{ roadType: string, street: string, fullStreet: string }])
                .map((street) => {
                    return { value: street.fullStreet, label: street.fullStreet }
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