const initialState: InitialTodolistsStateType[] = [
    {id: "todolist1", title: "What to buy", filter: "all"},
    {id: "todolist2", title: "Tasks 14.11.2023", filter: "all"},
    {id: "todolist3", title: "Study plan", filter: "all"}
]
export const TodolistReducer = (state: InitialTodolistsStateType[] = initialState, aciton: TodolistsReducerActionsType): InitialTodolistsStateType[] => {
    switch (aciton.type){
        case "Todolist/ADD-TODOLIST":
            return [{id: "todolist4", title: aciton.title, filter: "all"}, ...state]
        case "Todolist/REMOVE-TODOLIST":
            return state.filter(td => td.id !== aciton.id)
        default:
            return state
    }
}

//actions

export const addTodolistAC = (title: string) => ({type: "Todolist/ADD-TODOLIST", title} as const)
export const removeTodolistAC = (id: string) => ({type: "Todolist/REMOVE-TODOLIST", id} as const)

// types
export type FilterType = "all" | "active" | "completed"

export type InitialTodolistsStateType = {
    id: string,
    title: string,
    filter: FilterType
}

export type TodolistsReducerActionsType = ReturnType<typeof addTodolistAC> | ReturnType<typeof removeTodolistAC>