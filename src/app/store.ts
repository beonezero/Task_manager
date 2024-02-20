import { todolistsReducer } from "features/TodolistsList/todolists-reducer"
import { ThunkDispatch } from "redux-thunk"
import { appReducer } from "./app-reducer"
import { authReducer } from "features/auth/auth-reducer"
import { configureStore, UnknownAction } from "@reduxjs/toolkit"
import { tasksReducer } from "features/TodolistsList/tasks-reducer"
import { TypedUseSelectorHook, useSelector } from "react-redux"

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
})

export type AppRootStateType = ReturnType<typeof store.getState>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, unknown, UnknownAction>
