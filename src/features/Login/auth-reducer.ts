import { authAPI, UserType } from "api/todolist-api"
import { LoginDataType } from "./Login"
import { setAppIsInitialized, setAppStatus } from "App/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { clearState } from "features/TodolistList/todolists-reducer"
import { createSlice } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"
import { RESULT_CODE } from "features/TodolistList/task-reducer"

const login = createAppAsyncThunk<{ value: boolean }, LoginDataType>("auth/login", async (data, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await authAPI.login(data)
    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(setAppStatus({ status: "succeeded" }))
      return { value: true }
    } else {
      handleServerAppError<{ userId: number }>(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e as { message: string })
    return rejectWithValue(null)
  }
})

const logout = createAppAsyncThunk<{ value: boolean }, void>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await authAPI.logout()
    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(setAppStatus({ status: "succeeded" }))
      dispatch(clearState())
      return { value: false }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e as { message: string })
    return rejectWithValue(null)
  }
})

const me = createAppAsyncThunk<{ value: boolean }, void>("auth/me", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: "succeeded" }))
      return { value: true }
    } else {
      handleServerAppError<UserType>(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e as { message: string })
    return rejectWithValue(null)
  } finally {
    dispatch(setAppIsInitialized({ initialized: true }))
  }
})

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false as boolean },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(me.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.value
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.value
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.value
      })
  },
})

export const authReducer = slice.reducer
export const authThunks = { login, logout, me }
