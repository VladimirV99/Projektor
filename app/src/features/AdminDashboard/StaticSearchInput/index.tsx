import React, { Fragment, useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { AnyArray } from 'immer/dist/internal';
import axios from 'axios';

type Props = {
    staticOptions: { id: any; label: string }[];
    onOptionClicked: (option: any) => void;
};

function StaticSearchInput({
    staticOptions,
    onOptionClicked,
}: Props): JSX.Element {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<AnyArray>(staticOptions);

    useEffect(() => {
        if (searchTerm.trim().length === 0) {
            setSearchResults(staticOptions);
        }
        setSearchResults(
            staticOptions.filter((option) =>
                option.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm]);

    return (
        <Fragment>
            <Autocomplete
                onChange={(e, selectedOption) => {
                    if (!selectedOption) {
                        return;
                    }
                    onOptionClicked({
                        id: (selectedOption as { id: any; label: string }).id,
                        label: (selectedOption as { id: any; label: string })
                            .label,
                    });
                }}
                options={searchResults}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                )}
            />
        </Fragment>
    );
}

export default StaticSearchInput;
