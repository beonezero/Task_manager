import {authAPI, UserType} from "../api/todolist-api";
import {LoginDataType} from "../features/Login/Login";
import {Dispatch} from "redux";
import {setAppIsInitialized, setAppStatus} from "../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {clearState} from "../features/TodolistList/todolist-reducer";

const initialState: AppStateType = {
    isLoggedIn: false
}
export const authReducer = (state: AppStateType = initialState, action: AuthActionType): AppStateType => {
    switch (action.type){
        case "AUTH/SET-IS_LOGGED_IN": {
            return {...state, isLoggedIn: action.logged}
        }
        default: return state
    }
}

export const setAuthIsLoggedIn = (logged: boolean) => ({type: "AUTH/SET-IS_LOGGED_IN", logged} as const)

export const loginTC = (data: LoginDataType) => async (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0){
            dispatch(setAuthIsLoggedIn(true))
            dispatch(setAppStatus("succeeded"))
        } else {
            handleServerAppError<{userId: number}>(dispatch, res.data)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e as {message: string})
    }
}

export const meTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0){
            dispatch(setAuthIsLoggedIn(true))
            dispatch(setAppStatus("succeeded"))
        } else {
            handleServerAppError<UserType>(dispatch, res.data)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e as {message: string})
    } finally {
        dispatch(setAppIsInitialized(true))
    }
}

export const logoutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0){
            dispatch(setAuthIsLoggedIn(false))
            dispatch(setAppStatus("succeeded"))
            dispatch(clearState())
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e as {message: string})
    }
}

//types

type AppStateType = {
    isLoggedIn: boolean
}

export type SetAppIsLoggedInType = ReturnType<typeof  setAuthIsLoggedIn>

type AuthActionType = SetAppIsLoggedInType