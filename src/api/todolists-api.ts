import axios from "axios"

const settings = {
  withCredentials: true,
  headers: {
    "API-KEY": "1cdd9f77-c60e-4af5-b194-659e4ebd5d41",
  },
}
const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  ...settings,
})

// api
export const todolistsAPI = {
  getTodolists() {
    const promise = instance.get<TodolistType[]>("todo-lists")
    return promise
  },
  createTodolist(title: string) {
    const promise = instance.post<BaseResponseType<{ item: TodolistType }>>("todo-lists", { title: title })
    return promise
  },
  deleteTodolist(id: string) {
    const promise = instance.delete<BaseResponseType>(`todo-lists/${id}`)
    return promise
  },
  updateTodolist(id: string, title: string) {
    const promise = instance.put<BaseResponseType>(`todo-lists/${id}`, { title: title })
    return promise
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  createTask(todolistId: string, taskTitile: string) {
    return instance.post<BaseResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, { title: taskTitile })
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<BaseResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}

export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}

export const authAPI = {
  login(data: LoginParamsType) {
    const promise = instance.post<BaseResponseType<{ userId?: number }>>("auth/login", data)
    return promise
  },
  logout() {
    const promise = instance.delete<BaseResponseType<{ userId?: number }>>("auth/login")
    return promise
  },
  me() {
    const promise = instance.get<BaseResponseType<{ id: number; email: string; login: string }>>("auth/me")
    return promise
  },
}

// types
export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type BaseResponseType<D = {}> = {
  resultCode: number
  messages: Array<string>
  data: D
}
export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}
export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export enum RESULT_CODE {
  SUCCEEDED = 0,
  FAILED = 1,
  RECAPTCHA_FAILED = 10,
}

export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  completed: boolean
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModelType = {
  title: string
  description: string
  completed: boolean
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}

type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}
