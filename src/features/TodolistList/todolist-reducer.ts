import { todolistsAPI, TodolistType } from "api/todolist-api"
import { Dispatch } from "redux"
import { RequestStatusType, setAppStatus } from "App/app-reducer"
import { RESULT_CODE, tasksThunks } from "./task-reducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: TodolistDomainType[] = []

export const slice = createSlice({
  name: "todolists",
  initialState: initialState,
  reducers: {
    setTodolist(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
      return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
    },
    addTodolist(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    },
    removeTodolist(state, action: PayloadAction<{ todolistId: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      if (index > -1) {
        state.splice(index, 1)
      }
    },
    updateTodolist(state, action: PayloadAction<{ todolistId: string; title: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      if (index > -1) {
        state[index].title = action.payload.title
      }
    },
    changeTodolistFilter(state, action: PayloadAction<{ todolistId: string; filter: FilterType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      if (index > -1) {
        state[index].filter = action.payload.filter
      }
    },
    setEntityStatus(state, action: PayloadAction<{ todolistId: string; status: RequestStatusType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      if (index > -1) {
        state[index].entityStatus = action.payload.status
      }
    },
    clearState(state) {
      state = []
    },
  },
})

export const TodolistReducer = slice.reducer

//actions
export const setTodolist = slice.actions.setTodolist
export const addTodolist = slice.actions.addTodolist
export const removeTodolist = slice.actions.removeTodolist
export const updateTodolist = slice.actions.updateTodolist
export const changeTodolistFilter = slice.actions.changeTodolistFilter
export const setEntityStatus = slice.actions.setEntityStatus
export const clearState = slice.actions.clearState

export const fetchTodolistsTC = () => (dispatch: any) => {
  todolistsAPI
    .getTodolist()
    .then((res) => {
      dispatch(setTodolist({ todolists: res.data }))
      dispatch(setAppStatus({ status: "succeeded" }))
      return res.data
    })
    .then((res) => {
      res.forEach((tl) => {
        dispatch(tasksThunks.fetchTasks(tl.id))
      })
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  todolistsAPI
    .createTodolist(title)
    .then((res) => {
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(setAppStatus({ status: "succeeded" }))
        dispatch(addTodolist({ todolist: res.data.data.item }))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  dispatch(setEntityStatus({ todolistId: todolistId, status: "loading" }))
  todolistsAPI
    .deleteTodolist(todolistId)
    .then((res) => {
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(setAppStatus({ status: "succeeded" }))
        dispatch(removeTodolist({ todolistId: todolistId }))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
      dispatch(setEntityStatus({ todolistId: todolistId, status: "failed" }))
    })
}

export const updateTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  todolistsAPI
    .updateTodolist(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(setAppStatus({ status: "succeeded" }))
        dispatch(updateTodolist({ todolistId: todolistId, title: title }))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
}

//types

export type FilterType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
  filter: FilterType
  entityStatus: RequestStatusType
}
