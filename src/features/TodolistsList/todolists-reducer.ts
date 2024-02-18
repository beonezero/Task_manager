import { todolistsAPI, TodolistType } from "../../api/todolists-api"
import { Dispatch } from "redux"
import { RequestStatusType, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from "../../app/app-reducer"
import { handleServerNetworkError } from "../../utils/error-utils"
import { AppThunk } from "../../app/store"
import { createSlice } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

const initialState: Array<TodolistDomainType> = []

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  "todolists/removeTodolist",
  async (todolistId, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi
    try {
      dispatch(setAppStatusAC("loading"))
      const res = await todolistsAPI.deleteTodolist(todolistId)
      dispatch(setAppStatusAC("succeeded"))
      return { todolistId: todolistId }
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
export const todolistsThunks = { removeTodolist }

// actions
export const removeTodolistAC = (id: string) => ({ type: "REMOVE-TODOLIST", id }) as const
export const addTodolistAC = (todolist: TodolistType) => ({ type: "ADD-TODOLIST", todolist }) as const
export const changeTodolistTitleAC = (id: string, title: string) =>
  ({
    type: "CHANGE-TODOLIST-TITLE",
    id,
    title,
  }) as const
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
  ({
    type: "CHANGE-TODOLIST-FILTER",
    id,
    filter,
  }) as const
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
  ({
    type: "CHANGE-TODOLIST-ENTITY-STATUS",
    id,
    status,
  }) as const
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({ type: "SET-TODOLISTS", todolists }) as const

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatusAC("succeeded"))
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: ThunkDispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatusAC("loading"))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatusAC(todolistId, "loading"))
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolistAC(todolistId))
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(setAppStatusAC("succeeded"))
    })
  }
}
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
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodolistsActionType
  | ReturnType<typeof changeTodolistEntityStatusAC>
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>
