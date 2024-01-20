import {todolistsAPI, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";

const initialState: TodolistDomainType[] = []
export const TodolistReducer = (state: TodolistDomainType[] = initialState, action: TodolistsReducerActionsType): TodolistDomainType[] => {
    switch (action.type){
        case "TODOLIST/SET-TODOLIST":
            return action.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        case "TODOLIST/ADD-TODOLIST":
            return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        case "TODOLIST/REMOVE-TODOLIST":
            return state.filter(td => td.id !== action.todolistId)
        case "TODOLIST/UPDATE-TODOLIST":
            return state.map(td => td.id === action.todolistId ? {...td, title: action.title} : td)
        case "TODOLIST/CHANGE-FILTER": {
            return state.map((td) => td.id === action.todolistId ? {...td, filter: action.filter} : td)
        }
        default:
            return state
    }
}

//actions
export const setTodolistAC = (todolists: TodolistType[]) => ({type: "TODOLIST/SET-TODOLIST", todolists}) as const
export const addTodolistAC = (todolist: InitialTodolistsStateType) => ({type: "TODOLIST/ADD-TODOLIST", todolist}) as const
export const removeTodolistAC = (todolistId: string) => ({type: "TODOLIST/REMOVE-TODOLIST", todolistId}) as const
export const updateTodolistAC = (todolistId: string, title: string) => ({type: "TODOLIST/UPDATE-TODOLIST", todolistId, title}) as const
export const changeTodolistFilterAC = (todolistId: string, filter: FilterType) => ({type: "TODOLIST/CHANGE-FILTER", todolistId, filter}) as const

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    todolistsAPI.getTodolist()
        .then((res) => {
                dispatch(setTodolistAC(res.data))
                }
            )
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTodolist(title)
        .then((res) => {
                dispatch(addTodolistAC(res.data.data.item))
            }
        )
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            dispatch(removeTodolistAC(todolistId))
        })
}

export const updateTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(todolistId, title)
        .then((res) => {
            dispatch(updateTodolistAC(todolistId, title))
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

export type SetTodolistType = ReturnType<typeof setTodolistAC> | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC> | ReturnType<typeof updateTodolistAC>
    | ReturnType<typeof changeTodolistFilterAC>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type TodolistDomainType = TodolistType & {
    filter: FilterType,
    entityStatus: RequestStatusType
}

