import React, {useState} from 'react';
import {v1} from "uuid";
import {Todolist} from "./components/Todolist";
import s from "./App.module.css"
import {AddItemForm} from "./components/AddItemForm";

export const App = () => {
    const [todolists, setTodolists] = useState<TodolistType[]>([
            {id: "todolist1", title: "What to buy", filter: "all"},
            {id: "todolist2", title: "Tasks 14.11.2023", filter: "all"},
            {id: "todolist3", title: "Study plan", filter: "all"}
        ]
    )
    const [tasks, setTasks] = useState<TasksType>({
        ["todolist1"]: [
            {id: v1(), title: "Washing powder", isDone: true},
            {id: v1(), title: "Broad", isDone: false},
            {id: v1(), title: "Water", isDone: true},
        ],
        ["todolist2"]: [
            {id: v1(), title: "Study", isDone: true},
            {id: v1(), title: "Wash yourself", isDone: false},
            {id: v1(), title: "Drive to work", isDone: true},
        ],
        ["todolist3"]: [
            {id: v1(), title: "Task manager", isDone: true},
            {id: v1(), title: "JS native", isDone: false},
            {id: v1(), title: "5 sprint", isDone: false},
        ],
    })
    return <div className={s.App}>
        <div className={s.AddTask}>
            <h2>Add Task</h2>
            <AddItemForm buttonName={"+"}/>
        </div>
        <div className={s.Todolist}>
            {todolists.map(td => {
                return <Todolist key={td.id}
                                 todolist={td}
                                 tasks={tasks[td.id]}
                />
            })}
        </div>
    </div>

}

// types

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type TasksType = {
    [key: string]: TaskType[]
}

export type TodolistType = {
    id: string,
    title: string,
    filter: FilterType
}

export type FilterType = "all" | "active" | "completed"