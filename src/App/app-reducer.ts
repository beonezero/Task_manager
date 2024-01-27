
const initialState: AppStateType = {
    status: "loading",
    error: null,
    isInitialized: false
}
export const appReducer = (state: AppStateType = initialState, action: AppActionType): AppStateType => {
    switch (action.type){
        case "APP/SET-STATUS": {
            return {...state, status: action.status}
        }
        case "APP/SET-ERROR": {
            return {...state, error: action.error}
        }
        case "APP/SET-IS_INITIALIZED": {
            return {...state, isInitialized: action.isInitialized}
        }
        default: return state
    }
}

export const setAppStatus = (status: RequestStatusType) => ({type: "APP/SET-STATUS", status} as const)
export const setAppError = (error: null | string) => ({type: "APP/SET-ERROR", error} as const)
export const setAppIsInitialized = (isInitialized: boolean) => ({type: "APP/SET-IS_INITIALIZED", isInitialized} as const)

//types

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

type AppStateType = {
    status: RequestStatusType
    error: null | string
    isInitialized: boolean
}

export type SetAppStatusType = ReturnType<typeof setAppStatus>
export type SetAppErrorType = ReturnType<typeof  setAppError>
export type SetAppIsInitializedType = ReturnType<typeof  setAppIsInitialized>

type AppActionType = SetAppStatusType | SetAppErrorType | SetAppIsInitializedType