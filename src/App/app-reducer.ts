
const initialState: AppStateType = {
    status: "loading",
    error: null
}
export const appReducer = (state: AppStateType = initialState, action: AppActionType): AppStateType => {
    switch (action.type){
        case "APP/SET-STATUS": {
            return {...state, status: action.status}
        }
        case "APP/SET-ERROR": {
            return {...state, error: action.error}
        }
        default: return state
    }
}

export const setAppStatus = (status: RequestStatusType) => ({type: "APP/SET-STATUS", status} as const)
export const setAppError = (error: null | string) => ({type: "APP/SET-ERROR", error} as const)

//types

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

type AppStateType = {
    status: RequestStatusType
    error: null | string
}

export type SetAppStatusType = ReturnType<typeof setAppStatus>
export type SetAppErrorType = ReturnType<typeof  setAppError>

type AppActionType = SetAppStatusType | SetAppErrorType