import { Dispatch } from "redux"
import { appActions } from "app/app-reducer"

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(appActions.setAppError({ error: error.message ? error.message : "Some error occurred" }))
  dispatch(appActions.setAppStatus({ status: "failed" }))
}
