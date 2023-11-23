import {v1} from "uuid";
import {addTodolistType} from "./todolist-reducer";

const initialState = {
    ["todolist1"]: [
        {id: v1(), title: "Washing powder", isDone: true},
        {id: v1(), title: "Broad", isDone: false},
        {id: v1(), title: "Water", isDone: true},
    ],
    ["todolist2"]: [
        {id: v1(), title: "Study", isDone: true},
        {id: v1(), title: "Wash yourself", isDone: false},
        {id: v1(), title: "Drive to work", isDone: true},
    ],
    ["todolist3"]: [
        {id: v1(), title: "Task manager", isDone: true},
        {id: v1(), title: "JS native", isDone: false},
        {id: v1(), title: "5 sprint", isDone: false},
    ],
}

export const taskReducer = (state: InitialTasksType = initialState, action: TasksActionType): InitialTasksType => {
    switch (action.type) {
        case "TODOLIST/ADD-TODOLIST":
            return {...state, [action.todolistId]: []}
        case "TASK/ADD-TASK":
            const newTask = {id: v1(), title: action.title, isDone: false}
            return {...state, [action.todolistId]: [newTask, ...state[action.todolistId]]}
        case "TASK/REMOVE-TASK":
            return {...state, [action.todolistId]: [...state[action.todolistId].filter(t => t.id !== action.taskId)]}
        case "TASK/CHANGE/TASK/STATUS":
            return {
                ...state, [action.todolistId]: [...state[action.todolistId].map(t => {
                        return t.id === action.taskId ? {...t, isDone: action.checked} : t
                    }
                )]
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
    ({type: "TASK/CHANGE/TASK/STATUS", todolistId, taskId, checked} as const)

export type InitialTasksType = {
    [key: string]: TaskType[]
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type TasksActionType = ReturnType<typeof addTaskAC> | addTodolistType | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
