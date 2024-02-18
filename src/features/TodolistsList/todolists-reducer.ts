import { RESULT_CODE, todolistsAPI, TodolistType } from "api/todolists-api"
import { Dispatch } from "redux"
import { RequestStatusType, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from "app/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { AppThunk } from "app/store"
import { createSlice } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

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

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      const index = state.findIndex((td) => {
        td.id === action.payload.todolistId
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
    })
  },
})

export const todolistsReducer = slice.reducer
export const todolistsThunks = { removeTodolist, fetchTodolists }

// thunks
export const addTodolistTC = (title: string) => {
  return (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolistAC(res.data.data.item))
      dispatch(setAppStatusAC("succeeded"))
    })
  }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(changeTodolistTitleAC(id, title))
    })
  }
}

// types
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>
