import {AddTodolistType, SetTodolistType} from "./todolist-reducer";
import {TaskType} from "../api/todolist-api";

const initialState: TaskStateType = {}

export const taskReducer = (state: TaskStateType = initialState, action: TasksActionType): TaskStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        default:
            return state
    }
}

export const addTaskAC = (todolistId: string, title: string) => ({type: "TASK/ADD-TASK", todolistId, title} as const)
export const removeTaskAC = (todolistId: string, taskId: string) => ({
    type: "TASK/REMOVE-TASK",
    todolistId,
    taskId
} as const)
export const changeTaskStatusAC = (todolistId: string, taskId: string, checked: boolean) =>
    ({type: "TASK/CHANGE-TASK-STATUS", todolistId, taskId, checked} as const)

export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string) =>
    ({type: "TASK/CHANGE-TASK-TITLE", todolistId, taskId, title} as const)


export type TaskStateType = {
    [key: string]: TaskType[]
}

export type TasksActionType = ReturnType<typeof addTaskAC> | AddTodolistType | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof changeTaskStatusAC> | ReturnType<typeof changeTaskTitleAC> | SetTodolistType
