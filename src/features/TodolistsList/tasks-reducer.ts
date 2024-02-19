import { RESULT_CODE, TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api"
import { setAppStatusAC } from "app/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { createSlice } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"
import { todolistsThunks } from "features/TodolistsList/todolists-reducer"

const fetchTasks = createAppAsyncThunk<{ todolistId: string; tasks: TaskType[] }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(setAppStatusAC("loading"))
      const res = await todolistsAPI.getTasks(todolistId)
      dispatch(setAppStatusAC("succeeded"))
      return { todolistId: todolistId, tasks: res.data.items }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  },
)

const removeTask = createAppAsyncThunk<{ todolistId: string; taskId: string }, { todolistId: string; taskId: string }>(
  "tasks/removeTask",
  async ({ todolistId, taskId }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(setAppStatusAC("loading"))
      const res = await todolistsAPI.deleteTask(todolistId, taskId)
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(setAppStatusAC("succeeded"))
        return { todolistId, taskId }
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

const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
  "tasks/addTaskTC",
  async ({ todolistId, title }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(setAppStatusAC("loading"))
      const res = await todolistsAPI.createTask(todolistId, title)
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(setAppStatusAC("succeeded"))
        return { task: res.data.data.item }
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

const updateTask = createAppAsyncThunk<
  { task: TaskType },
  { todolistId: string; taskId: string; domainModel: UpdateDomainTaskModelType }
>("tasks/updateTask", async ({ todolistId, taskId, domainModel }, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI
  try {
    dispatch(setAppStatusAC("loading"))
    const task = getState().tasks[todolistId].find((t) => t.id === taskId)
    if (task) {
      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...domainModel,
      }
      const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(setAppStatusAC("succeeded"))
        return { task: res.data.data }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } else {
      dispatch(setAppStatusAC("failed"))
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((td) => {
          state[td.id] = []
        })
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
        if (index !== -1) {
          state[action.payload.todolistId].splice(index, 1)
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state[action.payload.task.todoListId].findIndex((t) => t.id === action.payload.task.id)
        if (index !== -1) {
          state[action.payload.task.todoListId].splice(index, 1, action.payload.task)
        }
      })
  },
})

export const tasksReducer = slice.reducer
export const tasksThunks = { fetchTasks, removeTask, addTask, updateTask }

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: TaskType[]
}
