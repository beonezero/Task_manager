import { TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolist-api"
import { clearState, todolistsThunks } from "features/TodolistList/todolists-reducer"
import { setAppStatus } from "App/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { createSlice } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

const fetchTasks = createAppAsyncThunk<
  {
    todolistId: string
    tasks: TaskType[]
  },
  string
>("tasks/fetchTasks", async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await todolistsAPI.getTasks(todolistId)
    dispatch(setAppStatus({ status: "succeeded" }))
    return {
      todolistId: todolistId,
      tasks: res.data.items,
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e)
    return rejectWithValue(null)
  }
})

const deleteTask = createAppAsyncThunk<
  { todolistId: string; taskId: string },
  {
    todolistId: string
    taskId: string
  }
>("tasks/deleteTask", async ({ todolistId, taskId }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await todolistsAPI.removeTask(todolistId, taskId)
    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(
        setAppStatus({
          status: "succeeded",
        }),
      )
      return {
        todolistId: todolistId,
        taskId: taskId,
      }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e)
    return rejectWithValue(null)
  }
})

const createTask = createAppAsyncThunk<
  { task: TaskType },
  {
    todolistId: string
    title: string
  }
>("tasks/createTask", async ({ todolistId, title }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await todolistsAPI.createTask(todolistId, title)
    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(
        setAppStatus({
          status: "succeeded",
        }),
      )
      return { task: res.data.data.item }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e)
    return rejectWithValue(null)
  }
})

const updateTask = createAppAsyncThunk<
  { task: TaskType },
  {
    todolistId: string
    taskId: string
    model: ModelDomainType
  }
>("tasks/updateTask", async ({ todolistId, taskId, model }, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const state = getState()
    const task = state.tasks[todolistId].find((t) => t.id === taskId)
    if (task) {
      const apiModel: UpdateTaskModelType = {
        description: task.description,
        title: task.title,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        status: task.status,
        ...model,
      }
      const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(setAppStatus({ status: "succeeded" }))
        return { task: res.data.data.item }
      } else {
        handleServerAppError(dispatch, res.data)
        return rejectWithValue(null)
      }
    } else {
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e)
    return rejectWithValue(null)
  }
})

export const slice = createSlice({
  name: "tasks",
  initialState: {} as TaskStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId]
        const index = tasks.findIndex((t) => t.id === action.payload.task.id)
        if (index > -1) {
          tasks[index] = {
            ...tasks[index],
            ...action.payload.task,
          }
        }
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task)
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
        if (index > -1) {
          state[action.payload.todolistId].splice(index, 1)
        }
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((td) => {
          state[td.id] = []
        })
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(clearState, () => {
        return {}
      })
  },
})

export const taskReducer = slice.reducer

export const tasksThunks = { fetchTasks, deleteTask, createTask, updateTask }

//types

export enum RESULT_CODE {
  SUCCEEDED = 0,
  FAILED = 1,
  RECAPTCHA_FAILED = 10,
}

export type TaskStateType = {
  [key: string]: TaskType[]
}

export type ModelDomainType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: number
  startDate?: string
  deadline?: string
}
