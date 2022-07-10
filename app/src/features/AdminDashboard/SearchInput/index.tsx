import React, { Fragment, useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { AnyArray } from 'immer/dist/internal';
import axios from 'axios';

type Props = {
    label?: string;
    searchEndpoint: string;
    maxOptions?: number;
    onOptionClicked: (option: any) => void;
    onInputCleared?: () => void;
    getOptions: (results: any[]) => { id: any; label: string }[];
    extractData?: (data: any) => any;
};

function SearchInput({
    label = '',
    searchEndpoint,
    maxOptions = 5,
    onOptionClicked,
    onInputCleared = () => {},
    getOptions,
    extractData = (data) => data,
}: Props): JSX.Element {
    const [searchTermInput, setSearchTermInput] = useState('');
    const [searchTerm] = useDebounce(searchTermInput, 500);
    const [searchResults, setSearchResults] = useState<AnyArray>([]);

    useEffect(() => {
        axios
            .get(searchEndpoint, {
                params: {
                    searchString: searchTerm,
                },
            })
            .then((response) => {
                setSearchResults(extractData(response.data));
            })
            .catch(() => {});
    }, [searchTerm]);

    return (
        <Fragment>
            <Autocomplete
                onChange={(e, selectedOption) => {
                    if (!selectedOption) {
                        onInputCleared();
                        return;
                    }
                    onOptionClicked({
                        id: selectedOption.id,
                        label: selectedOption.label,
                    });
                }}
                options={getOptions(searchResults).slice(0, maxOptions)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        onChange={(e) => setSearchTermInput(e.target.value)}
                    />
                )}
            />
        </Fragment>
    );
}

export default SearchInput;
