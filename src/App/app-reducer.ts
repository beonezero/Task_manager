import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: AppStateType = {
  status: "loading",
  error: null,
  isInitialized: false,
}

const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setAppIsInitialized(state, action: PayloadAction<{ initialized: boolean }>) {
      state.isInitialized = action.payload.initialized
    },
  },
})

export const appReducer = slice.reducer

export const { setAppStatus, setAppError, setAppIsInitialized } = slice.actions

//types

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

type AppStateType = {
  status: RequestStatusType
  error: null | string
  isInitialized: boolean
}
