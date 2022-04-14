import React, { Fragment, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Slider } from '@mui/material';
import Genre from 'models/Genre';
import * as S from './index.styles';
import FilterLimits from '../../models/FilterLimits';

type MovieFiltersProps = {
    genres: Genre[];
    filterLimits: FilterLimits
    onYearRangeChange: (min: number, max: number) => void;
    onLengthRangeChange: (min: number, max: number) => void;
    onGenreIdsChange: (genreIds: number[] | null) => void;
}

const MovieFilters = ({ genres, onYearRangeChange, onLengthRangeChange, onGenreIdsChange, filterLimits }: MovieFiltersProps): JSX.Element => {
    const [yearRange, setYearRange] = useState<number[]>([filterLimits.yearMin, filterLimits.yearMax]);
    const [lengthRange, setLengthRange] = useState<number[]>([filterLimits.lengthMin, filterLimits.lengthMax]);
    const [genreIds, setGenreIds] = useState<number[]>([]);

    const handleYearSliderChange = (event: Event, newValue: number | number[]) => {
        setYearRange(newValue as number[]);
    };

    const handleYearSliderChangeCommited = (event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]): void => {
        onYearRangeChange((newValue as number[])[0], (newValue as number[])[1]);
    }

    const handleLengthSliderChange = (event: Event, newValue: number | number[]) => {
        setLengthRange(newValue as number[]);
    };

    const handleLengthSliderChangeCommited = (event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]): void => {
        onLengthRangeChange((newValue as number[])[0], (newValue as number[])[1]);
    }

    useEffect(() => {
        onGenreIdsChange(genreIds.length > 0 ? genreIds : null);
    }, [genreIds]);

    return <Fragment>
        <h3>Advanced search:</h3>

        <h5>Year</h5>
        <Slider
            min={filterLimits.yearMin}
            max={filterLimits.yearMax}
            value={yearRange}
            onChange={handleYearSliderChange}
            onChangeCommitted={handleYearSliderChangeCommited}
            valueLabelDisplay="auto"
            getAriaValueText={(value: number) => value.toString()}
        />

        <h5>Length</h5>
        <Slider
            min={filterLimits.lengthMin}
            max={filterLimits.lengthMax}
            value={lengthRange}
            onChange={handleLengthSliderChange}
            onChangeCommitted={handleLengthSliderChangeCommited}
            valueLabelDisplay="auto"
            getAriaValueText={(value: number) => `${value} min`}
        />

        <h5>Genres</h5>
        <div>
            <div>
                <S.CheckBoxWrapper>
                    <input type="checkbox" checked={genreIds.length === 0} onChange={() => {
                        if (genreIds.length === 0){
                            return;
                        }
                        setGenreIds([]);
                    }} />
                </S.CheckBoxWrapper>
                All
            </div>
            {genres.map(({ id, name }) =>
                <div key={id}>
                    <S.CheckBoxWrapper>
                        <input type="checkbox" checked={genreIds.includes(id)} onChange={(e) => {
                            setGenreIds(genreIds => {
                                const newIds = [...genreIds]
                                if (genreIds.includes(id)) {
                                    newIds.splice(newIds.indexOf(id), 1);
                                } else {
                                    newIds.push(id);
                                }
                                return newIds;
                            })
                        }} />
                    </S.CheckBoxWrapper>

                    {name}

                </div>)}

        </div>


    </Fragment>
};

export default MovieFilters;