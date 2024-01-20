
const initialState: appStateType = {
    status: "loading"
}
export const appReducer = (state: appStateType = initialState, action: appActionType): appStateType => {
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

type appStateType = {
    status: RequestStatusType
}

type appActionType = ReturnType<typeof setAppStatus>