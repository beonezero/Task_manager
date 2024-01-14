import {TaskType, todolistsAPI} from "../api/todolist-api";
import {Dispatch} from "redux";
import {removeTodolistAC, setTodolistAC} from "./todolist-reducer";

const initialState: TaskStateType = {}

export const taskReducer = (state: TaskStateType = initialState, action: TasksActionType): TaskStateType => {
    switch (action.type) {
        case "TASK/REMOVE-TASK": {
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        }
        case "TODOLIST/REMOVE-TODOLIST": {
            const copyState = {...state}
            delete copyState[action.todolistId]
            return copyState
    }
        case "TODOLIST/SET-TODOLIST": {
            const copyState = {...state}
            action.todolists.forEach(td => {
                copyState[td.id] = []
            })
            return copyState
        }
        case "TASK/SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks}
        }
        default:
            return state
    }
}

const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({type: "TASK/SET-TASKS",todolistId, tasks}) as const
const removeTaskAC = (todolistId: string, taskId: string) => ({type: "TASK/REMOVE-TASK",todolistId, taskId}) as const

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(todolistId, res.data.items))
        })
    }

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistsAPI.removeTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(todolistId,taskId))
        })
}

//types


export type TaskStateType = {
    [key: string]: TaskType[]
}

export type TasksActionType = ReturnType<typeof setTasksAC> | ReturnType<typeof setTodolistAC>
    | ReturnType<typeof removeTodolistAC> | ReturnType<typeof removeTaskAC>
