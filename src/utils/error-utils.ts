import {Dispatch} from "redux";
import {setAppError, SetAppErrorType, setAppStatus, SetAppStatusType} from "../App/app-reducer";
import {ResponseType} from "../api/todolist-api";

export const handleServerNetworkError = (dispatch: ErrorUtilsDispatchType, error: {message: string}) => {
    dispatch(setAppError(error.message))
    dispatch(setAppStatus("failed"))
}

export const handleServerAppError = <T>(dispatch: ErrorUtilsDispatchType, data: ResponseType<T>) => {
    if (data.messages.length){
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError("some error update task"))
    }
    dispatch(setAppStatus("failed"))
}

//types

type ErrorUtilsDispatchType = Dispatch<SetAppStatusType | SetAppErrorType>