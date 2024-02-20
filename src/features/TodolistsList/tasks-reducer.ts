import { createSlice } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { todolistsActions, todolistsThunks } from "features/TodolistsList/todolists-reducer"
import { appActions } from "app/app-reducer"
import { tasksApi, TaskType, UpdateTaskModelType } from "features/TodolistsList/Todolist/tasksApi"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { RESULT_CODE, TaskPriorities, TaskStatuses } from "common/enum/enum"
import { handleServerAppError } from "common/utils/handleServerAppError"

const fetchTasks = createAppAsyncThunk<{ todolistId: string; tasks: TaskType[] }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      const res = await tasksApi.getTasks(todolistId)
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
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
      dispatch(appActions.setAppStatus({ status: "loading" }))
      const res = await tasksApi.deleteTask(todolistId, taskId)
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
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
      dispatch(appActions.setAppStatus({ status: "loading" }))
      const res = await tasksApi.createTask(todolistId, title)
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
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
    dispatch(appActions.setAppStatus({ status: "loading" }))
    const task = getState().tasks[todolistId].find((t) => t.id === taskId)
    if (task) {
      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        completed: task.completed,
        ...domainModel,
      }
      const res = await tasksApi.updateTask(todolistId, taskId, apiModel)
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { task: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } else {
      dispatch(appActions.setAppStatus({ status: "failed" }))
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
      .addCase(todolistsActions.clearState, () => {
        return {}
      })
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
  completed?: boolean
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: TaskType[]
}
