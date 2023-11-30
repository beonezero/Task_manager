const initialState: InitialTodolistsStateType[] = [
    {id: "todolist1", title: "What to buy", filter: "all"},
    {id: "todolist2", title: "Tasks 14.11.2023", filter: "all"},
    {id: "todolist3", title: "Study plan", filter: "all"}
]
export const TodolistReducer = (state: InitialTodolistsStateType[] = initialState, aciton: TodolistsReducerActionsType): InitialTodolistsStateType[] => {
    switch (aciton.type){
        case "TODOLIST/ADD-TODOLIST":
            return [{id: aciton.todolistId, title: aciton.title, filter: "all"}, ...state]
        case "TODOLIST/REMOVE-TODOLIST":
            return state.filter(td => td.id !== aciton.id)
        case "TODOLIST/CHANGE-FILTER":
            return state.map(tl => tl.id === aciton.todolistId ? {...tl, filter: aciton.filter} : tl)
        case "TODOLIST/CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === aciton.todolistId ? {...tl, title: aciton.title} : tl)
        default:
            return state
    }
}

//actions

export const addTodolistAC = (title: string, todolistId: string) => ({type: "TODOLIST/ADD-TODOLIST", title, todolistId} as const)
export const removeTodolistAC = (id: string) => ({type: "TODOLIST/REMOVE-TODOLIST", id} as const)

export const changeFilterAC = (todolistId: string, filter: FilterType) => ({type: "TODOLIST/CHANGE-FILTER", todolistId, filter} as const)

export const changeTodolistTitleAC = (todolistId: string, title: string) =>
    ({type: "TODOLIST/CHANGE-TODOLIST-TITLE", todolistId, title} as const)

// types
export type FilterType = "all" | "active" | "completed"

export type InitialTodolistsStateType = {
    id: string,
    title: string,
    filter: FilterType
}

export type TodolistsReducerActionsType = addTodolistType | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof changeFilterAC> | ReturnType<typeof changeTodolistTitleAC>

export type addTodolistType = ReturnType<typeof addTodolistAC>