
const initialState = [
    {id: "todolist1", title: "What to buy", filter: "all"},
    {id: "todolist2", title: "Tasks 14.11.2023", filter: "all"},
    {id: "todolist3", title: "Study plan", filter: "all"}
]
export const initialTodolistsStateType = (state: InitialTodolistsStateType = initialState, aciton: TodolistsReducerActionsType): InitialTodolistsStateType => {
    switch (aciton.type){
        default: return state
    }
}

// types

export type InitialTodolistsStateType = typeof initialState

export type TodolistsReducerActionsType = any