import { RESULT_CODE, todolistsAPI, TodolistType } from "api/todolists-api"
import { RequestStatusType, setAppStatusAC } from "app/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

//thunks

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, undefined>(
  "todolists/fetchTodolists",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(setAppStatusAC("loading"))
      const res = await todolistsAPI.getTodolists()
      dispatch(setAppStatusAC("succeeded"))
      return { todolists: res.data }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  },
)

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  "todolists/removeTodolist",
  async (todolistId, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi
    try {
      dispatch(setAppStatusAC("loading"))
      const res = await todolistsAPI.deleteTodolist(todolistId)
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(setAppStatusAC("succeeded"))
        return { todolistId: todolistId }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
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
    dispatch(setAppStatusAC("loading"))
    const res = await todolistsAPI.createTodolist(title)
    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(setAppStatusAC("succeeded"))
      return { todolist: res.data.data.item }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})

const changeTodolistTitle = createAppAsyncThunk<
  { todolistId: string; title: string },
  {
    todolistId: string
    title: string
  }
>("todolists/changeTodolistTitle", async ({ todolistId, title }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatusAC("loading"))
    const res = await todolistsAPI.updateTodolist(todolistId, title)
    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(setAppStatusAC("succeeded"))
      return { todolistId, title }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeFilter: (state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((td) => {
        td.id === action.payload.todolistId
      })
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    },
    changeEntityStatus: (state, action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((td) => {
        td.id === action.payload.todolistId
      })
      if (index !== -1) {
        state[index].entityStatus = action.payload.entityStatus
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((td) => {
          td.id === action.payload.todolistId
          if (index !== -1) {
            state.splice(index, 1)
          }
        })
      })
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((td) => {
          state.push({ ...td, filter: "all", entityStatus: "idle" })
        })
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
      })
  },
})

export const todolistsReducer = slice.reducer
export const todolistsThunks = { removeTodolist, fetchTodolists, addTodolist, changeTodolistTitle }

// types
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
