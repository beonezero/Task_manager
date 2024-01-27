import {TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../App/store";
import {addTodolistType, clearStateType, removeTodolist, setTodolist} from "./todolist-reducer";
import {setAppError, SetAppErrorType, setAppStatus, SetAppStatusType} from "../../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState: TaskStateType = {}

export const taskReducer = (state: TaskStateType = initialState, action: TasksActionType): TaskStateType => {
    switch (action.type) {
        case "TASK/UPDATE-TASK":
            return {
                ...state, [action.task.todoListId]: state[action.task.todoListId]
                    .map(t => t.id === action.task.id ? {...action.task} : t)
            }
        case "TASK/CREATE-TASK": {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case "TASK/REMOVE-TASK": {
            return {
                ...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        }
        case "TASK/SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks}
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
        case "TODOLIST/ADD-TODOLIST": {
            return {...state, [action.todolist.id]: []}
        }
        case "TODOLIST/CLEAR-STATE": {
            return {}
        }
        default:
            return state
    }
}

const setTasks = (todolistId: string, tasks: TaskType[]) => ({type: "TASK/SET-TASKS", todolistId, tasks}) as const
const removeTask = (todolistId: string, taskId: string) => ({type: "TASK/REMOVE-TASK", todolistId, taskId}) as const
const createTask = (task: TaskType) => ({type: "TASK/CREATE-TASK", task}) as const
const changeTaskStatus = (task: TaskType) => ({type: "TASK/UPDATE-TASK", task}) as const

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setAppStatus("succeeded"))
            dispatch(setTasks(todolistId, res.data.items))
        })
}
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    todolistsAPI.removeTask(todolistId, taskId)
        .then(() => {
            dispatch(setAppStatus("succeeded"))
            dispatch(removeTask(todolistId, taskId))
        })
        .catch((e) => {
            dispatch(setAppError(e.message))
            dispatch(setAppStatus("failed"))
        })
}
export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(setAppStatus("succeeded"))
                dispatch(createTask(res.data.data.item))
            } else {
                handleServerAppError<{item: TaskType}>(dispatch, res.data)
            }
        })
        .catch((e) => {
            handleServerNetworkError(dispatch, e)
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, model: ModelDomainType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatus("loading"))
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (task) {
            const apiModel: UpdateTaskModelType = {
                description: task.description,
                title: task.title,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                status: task.status,
                ...model
            }
            todolistsAPI.updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === RESULT_CODE.SUCCEEDED){
                        dispatch(setAppStatus("succeeded"))
                        dispatch(changeTaskStatus(res.data.data.item))
                    } else {
                        dispatch(setAppStatus("succeeded"))
                        if (res.data.messages.length){
                            dispatch(setAppError(res.data.messages[0]))
                        } else {
                            dispatch(setAppError("some error update task"))
                        }
                    }

                })
                .catch((e) => {
                    dispatch(setAppError(e.message))
                    dispatch(setAppStatus("failed"))
                })
        }
    }

//types

enum RESULT_CODE {
    SUCCEEDED = 0,
    FAILED = 1,
    RECAPTCHA_FAILED = 10
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

export type TasksActionType = ReturnType<typeof setTasks> | ReturnType<typeof setTodolist>
    | ReturnType<typeof removeTodolist> | ReturnType<typeof removeTask> | ReturnType<typeof createTask>
    | ReturnType<typeof changeTaskStatus> | SetAppStatusType | SetAppErrorType | addTodolistType
    | clearStateType
