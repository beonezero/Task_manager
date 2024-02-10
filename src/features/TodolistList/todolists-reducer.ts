import { todolistsAPI, TodolistType } from "api/todolist-api"
import { RequestStatusType, setAppStatus } from "App/app-reducer"
import { RESULT_CODE } from "./task-reducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

//thunks
const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  "todolists/fetchTodolists",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      const res = await todolistsAPI.getTodolist()
      dispatch(setAppStatus({ status: "succeeded" }))
      return { todolists: res.data }
    } catch (e) {
      handleServerNetworkError(dispatch, e)
      return rejectWithValue(null)
    }
  },
)

const addTodolist = createAppAsyncThunk<
  {
    todolist: TodolistType
  },
  string
>("todolists/addTodolist", async (title, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await todolistsAPI.createTodolist(title)
    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(setAppStatus({ status: "succeeded" }))
      return { todolist: res.data.data.item }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e)
    return rejectWithValue(null)
  }
})

const removeTodolist = createAppAsyncThunk<
  {
    todolistId: string
  },
  string
>("todolists/removeTodolist", async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    dispatch(setEntityStatus({ todolistId: todolistId, status: "loading" }))
    const res = await todolistsAPI.deleteTodolist(todolistId)
    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(setAppStatus({ status: "succeeded" }))
      return { todolistId }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e)
    dispatch(setEntityStatus({ todolistId: todolistId, status: "failed" }))
    return rejectWithValue(null)
  }
})

const updateTodolist = createAppAsyncThunk<{ todolistId: string; title: string }, { todolistId: string; title: string }>(
  "todolists/updateTodolist",
  async ({ todolistId, title }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(setAppStatus({ status: "loading" }))
      const res = await todolistsAPI.updateTodolist(todolistId, title)
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(setAppStatus({ status: "succeeded" }))
        return { todolistId: todolistId, title: title }
      } else {
        handleServerAppError(dispatch, res.data)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(dispatch, e)
      dispatch(setEntityStatus({ todolistId: todolistId, status: "failed" }))
      return rejectWithValue(null)
    }
  },
)

export const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
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
  extraReducers: (builder) => {
    builder
      .addCase(updateTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
        if (index > -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
      })
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
      })
  },
})

export const todolistsReducer = slice.reducer
export const todolistsThunks = { fetchTodolists, addTodolist, removeTodolist, updateTodolist }

//actions
export const changeTodolistFilter = slice.actions.changeTodolistFilter
export const setEntityStatus = slice.actions.setEntityStatus
export const clearState = slice.actions.clearState

//types

export type FilterType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
  filter: FilterType
  entityStatus: RequestStatusType
}
