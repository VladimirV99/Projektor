import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectIsUserLoggedIn } from '../../redux/auth/selectors'
import axiosAuthInstance from 'axios/instance'

const HomeScreen = () => {
    const accessToken = useSelector(
        (state: any) => state.featureReducer.authentication.accessToken
    )
    const refreshToken = useSelector(
        (state: any) => state.featureReducer.authentication.refreshToken
    )

    const [response, setResponse] = useState('')

    return (
        <div>
            <p>access: {accessToken}</p>
            <p>refresh: {refreshToken}</p>
            <button
                type="button"
                onClick={() => {
                    axiosAuthInstance
                        .get(
                            'http://localhost:5106/api/v1/Administrator/GetAllUsers'
                        )
                        .then((res) => {
                            setResponse(res.data)
                        })
                        .catch((err) => {
                            setResponse(err)
                        })
                }}
            >
                Get All Users
            </button>
            <div>{JSON.stringify(response)}</div>
        </div>
    )
}

export default HomeScreen
