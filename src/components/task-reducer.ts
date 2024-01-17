import {TaskStatuses, TaskType, todolistsAPI} from "../api/todolist-api";
import {Dispatch} from "redux";
import {removeTodolistAC, setTodolistAC} from "./todolist-reducer";
import {AppRootStateType} from "../store/store";

const initialState: TaskStateType = {}

export const taskReducer = (state: TaskStateType = initialState, action: TasksActionType): TaskStateType => {
    switch (action.type) {
        case "TASK/CHANGE-TASK-STATUS":
            return {...state, [action.task.todoListId]: state[action.task.todoListId]
                    .map(t => t.id === action.task.id ? {...t, status: action.task.status} : t)}
        case "TASK/CREATE-TASK": {
            return {...state,[action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
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
const createTaskAC = (task: TaskType) => ({type: "TASK/CREATE-TASK", task}) as const
const changeTaskStatusAC = (task: TaskType) => ({type: "TASK/CHANGE-TASK-STATUS", task}) as const

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
export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            dispatch(createTaskAC(res.data.data.item))
        })
}

export const changeTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (task){
        const model: TaskType = {
            description: task.description,
            title: task.title,
            completed: task.completed,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            id: task.id,
            todoListId: task.todoListId,
            order: task.order,
            addedDate: task.addedDate,
            status
    }
        todolistsAPI.updateTask(todolistId, taskId, model)
            .then((res) => {
                dispatch(changeTaskStatusAC(res.data.data.item))
            })
    }
}

//types


export type TaskStateType = {
    [key: string]: TaskType[]
}

export type TasksActionType = ReturnType<typeof setTasksAC> | ReturnType<typeof setTodolistAC>
    | ReturnType<typeof removeTodolistAC> | ReturnType<typeof removeTaskAC> | ReturnType<typeof createTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
