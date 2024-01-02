import {SetTodolistType} from "./todolist-reducer";
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

//types

export type TaskStateType = {
    [key: string]: TaskType[]
}

export type TasksActionType = SetTodolistType
