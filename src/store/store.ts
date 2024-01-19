import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import thunkMiddleware, {ThunkDispatch} from 'redux-thunk'
import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {TodolistReducer} from "../features/TodolistList/todolist-reducer";
import {taskReducer} from "../features/TodolistList/task-reducer";
import {composeWithDevTools} from "redux-devtools-extension";

const rootReducer = combineReducers({
    todolists: TodolistReducer,
    tasks: taskReducer
})

export const store = legacy_createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)))

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()

//types

export type AppRootStateType = ReturnType<typeof rootReducer>