import React, {useState} from 'react';
import {v1} from "uuid";
import {Todolist} from "./components/Todolist";
import s from "./App.module.css"
import {AddItemForm} from "./components/AddItemForm";
import {useAppDispatch, useAppSelector} from "./store/store";
import {addTodolistAC, removeTodolistAC} from "./components/Todolist-reducer";

export const App = () => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(store => store.todolist)
    // const [tasks, setTasks] = useState<TasksType>({
    //     ["todolist1"]: [
    //         {id: v1(), title: "Washing powder", isDone: true},
    //         {id: v1(), title: "Broad", isDone: false},
    //         {id: v1(), title: "Water", isDone: true},
    //     ],
    //     ["todolist2"]: [
    //         {id: v1(), title: "Study", isDone: true},
    //         {id: v1(), title: "Wash yourself", isDone: false},
    //         {id: v1(), title: "Drive to work", isDone: true},
    //     ],
    //     ["todolist3"]: [
    //         {id: v1(), title: "Task manager", isDone: true},
    //         {id: v1(), title: "JS native", isDone: false},
    //         {id: v1(), title: "5 sprint", isDone: false},
    //     ],
    // })
    const addTodolist = (title: string) => {
        dispatch(addTodolistAC(title))
    }

    const removeTodolist = (todolistId: string) => {
        console.log(todolistId)
        dispatch(removeTodolistAC(todolistId))
    }

    return <div className={s.App}>
        <div className={s.AddTask}>
            <h2>Add Task</h2>
            <AddItemForm buttonName={"+"} addItem={addTodolist}/>
        </div>
        <div className={s.Todolist}>
            {todolists.map(td => {
                return <Todolist key={td.id}
                                 todolist={td}
                                 todolistId={td.id}
                                 removeTodolist={removeTodolist}
                                 //tasks={tasks}
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