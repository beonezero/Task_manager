import { authAPI, UserType } from "../../api/todolist-api"
import { LoginDataType } from "./Login"
import { Dispatch } from "redux"
import { setAppIsInitialized, setAppStatus } from "../../App/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils"
import { clearState } from "../TodolistList/todolist-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  isLoggedIn: false,
}

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAuthIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
})

export const authReducer = slice.reducer
export const { setAuthIsLoggedIn } = slice.actions

export const loginTC = (data: LoginDataType) => async (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  try {
    const res = await authAPI.login(data)
    if (res.data.resultCode === 0) {
      dispatch(setAuthIsLoggedIn({ value: true }))
      dispatch(setAppStatus({ status: "succeeded" }))
    } else {
      handleServerAppError<{ userId: number }>(dispatch, res.data)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e as { message: string })
  }
}

export const meTC = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      dispatch(setAuthIsLoggedIn({ value: true }))
      dispatch(setAppStatus({ status: "succeeded" }))
    } else {
      handleServerAppError<UserType>(dispatch, res.data)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e as { message: string })
  } finally {
    dispatch(setAppIsInitialized({ initialized: true }))
  }
}

export const logoutTC = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  try {
    const res = await authAPI.logout()
    if (res.data.resultCode === 0) {
      dispatch(setAuthIsLoggedIn({ value: false }))
      dispatch(setAppStatus({ status: "succeeded" }))
      dispatch(clearState())
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e as { message: string })
  }
}
