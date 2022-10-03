import axios from "axios";
import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";

export function Search(props: { onChangedStreet: (street: string) => void }) {
    const ip = '192.168.0.174';
    const port = '3005';
    let selectedStreet = '';

    const handleSelect = (street: string) => {
        selectedStreet = street;
        // getChartData();
        props.onChangedStreet(street);
    }

    // const getChartData = async () => {
    //     const from = new Date('2022-09-25');
    //     axios.get(`http://localhost:3005/api/issue/${selectedStreet}/all/${from}`).then((res) => {
    //         // setChartData((res.data as [{ block: string, datesAdded: Date[] }]));
    //     })
    // }

    const getOptions = async (value: string) => {
        return axios.get(`http://${ip}:${port}/api/issue/${value}`).then((res) => {
            const matchingStreets = (res.data as []).map((street) => {
                return { value: street, label: street }
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
                loadOptions={getOptions}
                onChange={(event) => { handleSelect(event!.value) }} />
        </>
    )
}