import React, { Fragment, useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { AnyArray } from 'immer/dist/internal';
import axios from 'axios';

type Props = {
    searchEndpoint: string;
    onOptionClicked: (option: any) => void;
    getOptions: (results: any[]) => { id: any; label: string }[];
};

function SearchInput({
    searchEndpoint,
    onOptionClicked,
    getOptions,
}: Props): JSX.Element {
    const [searchTermInput, setSearchTermInput] = useState('');
    const [searchTerm] = useDebounce(searchTermInput, 500);
    const [searchResults, setSearchResults] = useState<AnyArray>([]);

    useEffect(() => {
        if (searchTerm.trim().length === 0) {
            return;
        }
        axios
            .get(searchEndpoint, {
                params: {
                    searchString: searchTerm,
                },
            })
            .then((response) => {
                setSearchResults(response.data);
            })
            .catch(() => {});
    }, [searchTerm]);

    return (
        <Fragment>
            <Autocomplete
                onChange={(e, selectedOption) => {
                    if (!selectedOption) {
                        return;
                    }
                    // console.log('CLICKED OPTION', selectedOption);
                    onOptionClicked({
                        id: selectedOption.id,
                        label: selectedOption.label,
                    });
                }}
                options={getOptions(searchResults)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        onChange={(e) => setSearchTermInput(e.target.value)}
                    />
                )}
            />
        </Fragment>
    );
}

export default SearchInput;
