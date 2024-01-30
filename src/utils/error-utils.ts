import { Dispatch } from "redux"
import { setAppError, setAppStatus } from "../App/app-reducer"
import { ResponseType } from "../api/todolist-api"

export const handleServerNetworkError = (dispatch: Dispatch, error: { message: string }) => {
  dispatch(setAppError({ error: error.message }))
  dispatch(setAppStatus({ status: "failed" }))
}

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }))
  } else {
    dispatch(setAppError({ error: "some error update task" }))
  }
  dispatch(setAppStatus({ status: "failed" }))
}
