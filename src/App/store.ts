import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { ThunkDispatch } from "redux-thunk"
import { AnyAction, combineReducers } from "redux"
import { todolistsReducer } from "features/TodolistList/todolists-reducer"
import { taskReducer } from "features/TodolistList/task-reducer"
import { appReducer } from "./app-reducer"
import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "features/Login/auth-reducer"

const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: taskReducer,
  app: appReducer,
  auth: authReducer,
})

// @ts-ignore
export const store = configureStore({
  reducer: rootReducer,
})

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()

//types

export type AppRootStateType = ReturnType<typeof rootReducer>
