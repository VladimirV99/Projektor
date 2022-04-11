import React, { Fragment, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Formik } from 'formik';
import { Slider } from '@mui/material';

type MovieFiltersProps = {
    onYearRangeChange: (min: number, max: number) => void;
    onLengthRangeChange: (min: number, max: number) => void;
}

const MovieFilters = ( { onYearRangeChange, onLengthRangeChange } : MovieFiltersProps): JSX.Element => {
    const [yearRange, setYearRange] = useState<number[]>([1800, 2020]);
    const [lengthRange, setLengthRange] = useState<number[]>([0, 500]);

    const handleYearSliderChange = (event: Event, newValue: number | number[]) => {
        setYearRange(newValue as number[]);
    };

    const handleYearSliderChangeCommited = (event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]) : void => {
        onYearRangeChange((newValue as number[])[0], (newValue as number[])[1]);
    }

    const handleLengthSliderChange = (event: Event, newValue: number | number[]) => {
        setLengthRange(newValue as number[]);
    };

    const handleLengthSliderChangeCommited = (event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]) : void => {
        onLengthRangeChange((newValue as number[])[0], (newValue as number[])[1]);
    }

    return <Fragment>
        <h3>Advanced search:</h3>

        <h5>Year</h5>
        <Slider
            min={1800}
            max={2020}
            value={yearRange}
            onChange={handleYearSliderChange}
            onChangeCommitted={handleYearSliderChangeCommited}
            valueLabelDisplay="auto"
            getAriaValueText={(value: number) => value.toString()}
        />

        <h5>Length</h5>
        <Slider
            min={0}
            max={300}
            value={lengthRange}
            onChange={handleLengthSliderChange}
            onChangeCommitted={handleLengthSliderChangeCommited}
            valueLabelDisplay="auto"
            getAriaValueText={(value: number) => `${value} min`}
        />

    </Fragment>
};

export default MovieFilters;