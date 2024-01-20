
const initialState: AppStateType = {
    status: "loading"
}
export const appReducer = (state: AppStateType = initialState, action: AppActionType): AppStateType => {
    switch (action.type){
        case "APP/SET-STATUS": {
            return {...state, status: action.status}
        }
        default: return state
    }
}

export const setAppStatus = (status: RequestStatusType) => ({type: "APP/SET-STATUS", status} as const)

//types

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

type AppStateType = {
    status: RequestStatusType
}

export type SetAppStatusType = ReturnType<typeof setAppStatus>

type AppActionType = SetAppStatusType