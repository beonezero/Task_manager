import {AddItemForm} from "./AddItemForm";
import s from "./Todolist.module.css"
import {FilterType, InitialTodolistsStateType} from "./todolist-reducer";
import {ChangeEvent} from "react";
import {AditableSpan} from "./AditableSpan";
import {TaskType} from "../api/todolist-api";

export const Todolist = (props: TodolistPropsType) => {

    const onClickButtonHandler = () => {
        props.removeTodolist(props.todolistId)
    }

    const onAllClickHandler = () => {props.changeFilter(props.todolistId, "all")}
    const onActiveClickHandler = () => {props.changeFilter(props.todolistId, "active")}
    const onCompletedClickHandler = () => {props.changeFilter(props.todolistId, "completed")}

    return <div className={s.Todos}>
        <h2>
            <AditableSpan value={props.todolist.title} changeTitle={props.changeTodolistTitle}/>
            <button onClick={onClickButtonHandler}>-</button>
        </h2>

        <AddItemForm buttonName={"add"} addItem={props.addTask} todolistId={props.todolistId}/>
        <ul>
        {props.tasks.map(t => {
            const removeTaskHandler = () => {
                props.removeTask(props.todolistId, t.id)
            }
            const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
                props.changeTaskStatus(props.todolistId, t.id, e.currentTarget.checked)
            }
            const changeTaskTitle = (value: string) => {
                props.changeTasksTitle(t.id, value)
            }

            return <li key={t.id}>
                <input type="checkbox" onChange={onChangeInputHandler}/>
                <AditableSpan value={t.title} changeTitle={changeTaskTitle}/>
                <button onClick={removeTaskHandler}>x</button>
            </li>
        })}
        </ul>
        <button onClick={onAllClickHandler}>All</button>
        <button onClick={onActiveClickHandler}>Active</button>
        <button onClick={onCompletedClickHandler}>Completed</button>
    </div>
}

export type TodolistPropsType = {
    todolist: InitialTodolistsStateType
    todolistId: string
    removeTodolist: (todolistId: string) => void
    tasks: TaskType[]
    addTask: (title: string) => void
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolist: string, filter: FilterType) => void
    changeTaskStatus: (todolistId: string, taskId: string, checked: boolean) => void
    changeTasksTitle: (taskId: string, value: string) => void
    changeTodolistTitle: (value: string) => void
}
