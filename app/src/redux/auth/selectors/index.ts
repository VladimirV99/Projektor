import { createSelector } from '@reduxjs/toolkit'
import { RootStateOrAny } from 'react-redux'
import {
    authenticationReducerName,
    AuthenticationReducerType,
} from '../reducers/types'
import { featuresReducerName } from '../types'

export const getState = (state: RootStateOrAny) =>
    state[featuresReducerName][authenticationReducerName]

export const selectUser = createSelector([getState], (state) => {
    const user = state.user
    return user
})
export const selectIsUserLoggedIn = createSelector(
    [selectUser],
    (user) => user !== null
)

export const selectAuthErrors = createSelector(
    [getState],
    (state) => state.errors
)
