import { GenreSliceType } from 'redux/reducers/Genre'
import { createSelector } from '@reduxjs/toolkit'

const getCoreState = (state: any): GenreSliceType =>
    state.genres as GenreSliceType

export const getGenresStatus = createSelector(
    [getCoreState],
    (state: GenreSliceType) => state.status
)

export const isGenresAlreadyLoaded = createSelector(
    [getGenresStatus],
    (status: string) => status === 'success'
)

export const getGenres = createSelector(
    [getCoreState],
    (state: GenreSliceType) => state.entities
)
