import { TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolist-api"
import { Dispatch } from "redux"
import { AppRootStateType } from "App/store"
import { addTodolist, clearState, removeTodolist, setTodolist } from "./todolist-reducer"
import { setAppStatus } from "App/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

const fetchTasks = createAppAsyncThunk<
  {
    todolistId: string
    tasks: TaskType[]
  },
  string
>("tasks", async (todolistId, thunkAPI) => {
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

export const slice = createSlice({
  name: "tasks",
  initialState: {} as TaskStateType,
  reducers: {
    removeTask(
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
      }>,
    ) {
      const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        state[action.payload.todolistId].splice(index, 1)
      }
    },
    createTask(
      state,
      action: PayloadAction<{
        task: TaskType
      }>,
    ) {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    },
    updateTask(
      state,
      action: PayloadAction<{
        task: TaskType
      }>,
    ) {
      const tasks = state[action.payload.task.todoListId]
      const index = tasks.findIndex((t) => t.id === action.payload.task.id)
      if (index > -1) {
        tasks[index] = {
          ...tasks[index],
          ...action.payload.task,
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(removeTodolist, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(setTodolist, (state, action) => {
        action.payload.todolists.forEach((td) => {
          state[td.id] = []
        })
      })
      .addCase(addTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(clearState, () => {
        return {}
      })
  },
})

export const taskReducer = slice.reducer

export const { removeTask, createTask, updateTask } = slice.actions

export const tasksThunks = { fetchTasks }

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  dispatch(
    setAppStatus({
      status: "loading",
    }),
  )
  todolistsAPI
    .removeTask(todolistId, taskId)
    .then((res) => {
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(
          setAppStatus({
            status: "succeeded",
          }),
        )
        dispatch(
          removeTask({
            todolistId: todolistId,
            taskId: taskId,
          }),
        )
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
}
export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  dispatch(
    setAppStatus({
      status: "loading",
    }),
  )
  todolistsAPI
    .createTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(
          setAppStatus({
            status: "succeeded",
          }),
        )
        dispatch(
          createTask({
            task: res.data.data.item,
          }),
        )
      } else {
        handleServerAppError<{
          item: TaskType
        }>(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
}
export const updateTaskTC =
  (todolistId: string, taskId: string, model: ModelDomainType) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(
      setAppStatus({
        status: "loading",
      }),
    )
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
      todolistsAPI
        .updateTask(todolistId, taskId, apiModel)
        .then((res) => {
          if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
            dispatch(
              setAppStatus({
                status: "succeeded",
              }),
            )
            dispatch(
              updateTask({
                task: res.data.data.item,
              }),
            )
          } else {
            handleServerAppError(dispatch, res.data)
          }
        })
        .catch((e) => {
          handleServerNetworkError(dispatch, e)
        })
    }
  }

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
