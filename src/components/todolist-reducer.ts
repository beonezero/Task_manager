import {todolistsAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";

const initialState: TodolistDomainType[] = []
export const TodolistReducer = (state: TodolistDomainType[] = initialState, aciton: TodolistsReducerActionsType): TodolistDomainType[] => {
    switch (aciton.type){
        case "TODOLIST/SET-TODOLIST":
            return aciton.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        // case "TODOLIST/ADD-TODOLIST":
        //     return [{id: aciton.todolistId, title: aciton.title, filter: "all"}, ...state]
        // case "TODOLIST/REMOVE-TODOLIST":
        //     return state.filter(td => td.id !== aciton.id)
        // case "TODOLIST/CHANGE-FILTER":
        //     return state.map(tl => tl.id === aciton.todolistId ? {...tl, filter: aciton.filter} : tl)
        // case "TODOLIST/CHANGE-TODOLIST-TITLE":
        //     return state.map(tl => tl.id === aciton.todolistId ? {...tl, title: aciton.title} : tl)
        default:
            return state
    }
}

//actions

export const setTodolistAC = (todolists: TodolistType[]) => ({type: "TODOLIST/SET-TODOLIST", todolists})

export const addTodolistAC = (title: string, todolistId: string) => ({type: "TODOLIST/ADD-TODOLIST", title, todolistId} as const)
export const removeTodolistAC = (id: string) => ({type: "TODOLIST/REMOVE-TODOLIST", id} as const)

export const changeFilterAC = (todolistId: string, filter: FilterType) => ({type: "TODOLIST/CHANGE-FILTER", todolistId, filter} as const)

export const changeTodolistTitleAC = (todolistId: string, title: string) =>
    ({type: "TODOLIST/CHANGE-TODOLIST-TITLE", todolistId, title} as const)

// types
export type FilterType = "all" | "active" | "completed"

export type InitialTodolistsStateType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    todolistsAPI.getTodolist()
        .then(
            (res) => {
                dispatch(setTodolistAC(res.data))
            })
}

export type TodolistsReducerActionsType = AddTodolistType | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof changeFilterAC> | ReturnType<typeof changeTodolistTitleAC>
    | SetTodolistType

export type AddTodolistType = ReturnType<typeof removeTodolistAC>
export type SetTodolistType = ReturnType<typeof setTodolistAC>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type TodolistDomainType = TodolistType & {
    filter: FilterType,
    entityStatus: RequestStatusType
}

