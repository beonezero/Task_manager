import {todolistsAPI, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppError, SetAppErrorType, setAppStatus, SetAppStatusType} from "../../App/app-reducer";
import {fetchTasksTC} from "./task-reducer";

const initialState: TodolistDomainType[] = []
export const TodolistReducer = (state: TodolistDomainType[] = initialState, action: TodolistActionType): TodolistDomainType[] => {
    switch (action.type) {
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
        case "TODOLIST/SET-ENTITY-STATUS": {
            return state.map(td => td.id === action.todolistId ? {...td, entityStatus: action.status} : td)
        }
        case "TODOLIST/CLEAR-STATE": {
            return []
        }
        default:
            return state
    }
}

//actions
export const setTodolist = (todolists: TodolistType[]) => ({type: "TODOLIST/SET-TODOLIST", todolists}) as const
export const addTodolistAC = (todolist: InitialTodolistsStateType) => ({
    type: "TODOLIST/ADD-TODOLIST",
    todolist
}) as const
export const removeTodolist = (todolistId: string) => ({type: "TODOLIST/REMOVE-TODOLIST", todolistId}) as const
export const updateTodolist = (todolistId: string, title: string) => ({
    type: "TODOLIST/UPDATE-TODOLIST",
    todolistId,
    title
}) as const
export const changeTodolistFilter = (todolistId: string, filter: FilterType) => ({
    type: "TODOLIST/CHANGE-FILTER",
    todolistId,
    filter
}) as const

export const setEntityStatus = (todolistId: string, status: RequestStatusType) => ({
    type: "TODOLIST/SET-ENTITY-STATUS",
    todolistId,
    status
}) as const

export const clearState = () => ({type: "TODOLIST/CLEAR-STATE"}) as const

export const fetchTodolistsTC = () => (dispatch: any) => {
    todolistsAPI.getTodolist()
        .then((res) => {
                dispatch(setTodolist(res.data))
                dispatch(setAppStatus("succeeded"))
                return res.data
            }
        )
        .then((res) => {
            res.forEach(tl => {
                dispatch(fetchTasksTC(tl.id))
            })
        })
        .catch((e) => {
            dispatch(setAppError(e.message))
            dispatch(setAppStatus("failed"))
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    todolistsAPI.createTodolist(title)
        .then((res) => {
                dispatch(setAppStatus("succeeded"))
                dispatch(addTodolistAC(res.data.data.item))
            }
        )
        .catch((e) => {
            dispatch(setAppError(e.message))
            dispatch(setAppStatus("failed"))
        })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    dispatch(setEntityStatus(todolistId, "loading"))
    todolistsAPI.deleteTodolist(todolistId)
        .then(() => {
            dispatch(setAppStatus("succeeded"))
            dispatch(removeTodolist(todolistId))
        })
        .catch((e) => {
            dispatch(setAppError(e.message))
            dispatch(setEntityStatus(todolistId, "failed"))
            dispatch(setAppStatus("failed"))
        })
}

export const updateTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    todolistsAPI.updateTodolist(todolistId, title)
        .then(() => {
            dispatch(setAppStatus("succeeded"))
            dispatch(updateTodolist(todolistId, title))
        })
        .catch((e) => {
            dispatch(setAppError(e.message))
            dispatch(setAppStatus("failed"))
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

export type addTodolistType = ReturnType<typeof addTodolistAC>

export type clearStateType = ReturnType<typeof clearState>

export type TodolistActionType = ReturnType<typeof setTodolist> | addTodolistType
    | ReturnType<typeof removeTodolist> | ReturnType<typeof updateTodolist>
    | ReturnType<typeof changeTodolistFilter> | SetAppStatusType | SetAppErrorType
    | ReturnType<typeof setEntityStatus> | clearStateType

export type TodolistDomainType = TodolistType & {
    filter: FilterType,
    entityStatus: RequestStatusType
}

