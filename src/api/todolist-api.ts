import axios from "axios";

    const instance = axios.create({
        baseURL: "https://social-network.samuraijs.com/api/1.1/",
        withCredentials: true
    })

    export const todolistsAPI = {
        getTodolist(){
            return instance.get<TodolistType[]>("todo-lists")
        },
        createTodolist(title: string){
            return instance.post<ResponseType<{item: TodolistType}>>("todo-lists", {title: title})
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
            return instance.delete(`todo-lists/{${todolistId}}/tasks/{${taskId}}`)
        },
        createTask (todolistId: string,title: string) {
            return instance.post(`todo-lists/{${todolistId}}/tasks`, {title: title})
        }
    }

//types


type ResponseType<T = {}> = {
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


export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}