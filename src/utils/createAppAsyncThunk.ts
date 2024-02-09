import { createAsyncThunk } from "@reduxjs/toolkit"
import { AppRootStateType, AppThunkDispatch } from "App/store"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppThunkDispatch
  rejectValue: null
}>()
