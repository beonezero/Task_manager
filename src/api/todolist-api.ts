import axios, {AxiosResponse} from "axios";
import {LoginDataType} from "../features/Login/Login";

    const instance = axios.create({
        baseURL: "https://social-network.samuraijs.com/api/1.1/",
        withCredentials: true
    })

    export const authAPI = {
        login(data: LoginDataType){
           return instance.post<null, AxiosResponse<ResponseType<{userId: number}>>, LoginDataType>("auth/login", data)
        }
    }

    export const todolistsAPI = {
        getTodolist(){
            return instance.get<TodolistType[]>("todo-lists")
        },
        createTodolist(title: string){
            return instance.post<null, AxiosResponse<ResponseType<{item: TodolistType}>>, {title: string}>("todo-lists", {title: title})
        },
        deleteTodolist(todolistId: string){
            return instance.delete<ResponseType>(`todo-lists/{${todolistId}}`)
        },
        updateTodolist(todolistId: string, title: string){
            return instance.put<ResponseType>(`todo-lists/{${todolistId}}`,{title: title})
        },
        getTasks(todolistId: string){
            return instance.get<getTasksResponseType>(`todo-lists/{${todolistId}}/tasks`)
        },
        removeTask (todolistId: string, taskId: string) {
            return instance.delete<ResponseType>(`todo-lists/{${todolistId}}/tasks/{${taskId}}`)
        },
        createTask (todolistId: string,title: string) {
            return instance.post<null, AxiosResponse<ResponseType<{item: TaskType}>>, {title: string}>(`todo-lists/{${todolistId}}/tasks`, {title: title})
        },
        updateTask (todolistId: string, taskId: string, model: UpdateTaskModelType) {
            return instance.put<null, AxiosResponse<ResponseType<{item: TaskType}>>, UpdateTaskModelType>(`todo-lists/{${todolistId}}/tasks/{${taskId}}`, model)
        }
    }

//types

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}


export type ResponseType<T = {}> = {
    data: T
    fieldsErrors: string []
    messages: string []
    resultCode: number
}

type getTasksResponseType = {
    items: TaskType[],
    totalCount: number,
    error: string
}

export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}