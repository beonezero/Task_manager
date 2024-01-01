import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import thunkMiddleware, {ThunkDispatch} from 'redux-thunk'
import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {TodolistReducer} from "../components/todolist-reducer";
import {taskReducer} from "../components/task-reducer";
import {composeWithDevTools} from "redux-devtools-extension";

const rootReducer = combineReducers({
    todolist: TodolistReducer,
    task: taskReducer
})

export const store = legacy_createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)))

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()

//types

export type AppRootStateType = ReturnType<typeof rootReducer>