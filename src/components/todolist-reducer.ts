import {todolistsAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";

const initialState: TodolistDomainType[] = []
export const TodolistReducer = (state: TodolistDomainType[] = initialState, aciton: TodolistsReducerActionsType): TodolistDomainType[] => {
    switch (aciton.type){
        case "TODOLIST/SET-TODOLIST":
            return aciton.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        default:
            return state
    }
}

//actions
export const setTodolistAC = (todolists: TodolistType[]) => ({type: "TODOLIST/SET-TODOLIST", todolists})

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    todolistsAPI.getTodolist()
        .then(
            (res) => {
                dispatch(setTodolistAC(res.data))
            })
}

//types

export type FilterType = "all" | "active" | "completed"

export type InitialTodolistsStateType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

export type TodolistsReducerActionsType = SetTodolistType

export type SetTodolistType = ReturnType<typeof setTodolistAC>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type TodolistDomainType = TodolistType & {
    filter: FilterType,
    entityStatus: RequestStatusType
}

