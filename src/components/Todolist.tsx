import {AddItemForm} from "./AddItemForm";
import s from "./Todolist.module.css"
import {FilterType, InitialTodolistsStateType} from "../features/TodolistList/todolist-reducer";
import {ChangeEvent, useEffect} from "react";
import {AditableSpan} from "./AditableSpan";
import {TaskStatuses, TaskType} from "../api/todolist-api";
import {createTaskTC, fetchTasksTC} from "../features/TodolistList/task-reducer";
import {useAppDispatch} from "../store/store";

export const Todolist = (props: TodolistPropsType) => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchTasksTC(props.todolistId))
    },[props.todolistId, dispatch])

    const onClickButtonHandler = () => {
        props.removeTodolist(props.todolistId)
    }

    const onAllClickHandler = () => {props.changeFilter(props.todolistId, "all")}
    const onActiveClickHandler = () => {props.changeFilter(props.todolistId, "active")}
    const onCompletedClickHandler = () => {props.changeFilter(props.todolistId, "completed")}

    const addTask = (title: string) => {
        dispatch(createTaskTC(props.todolistId, title))
    }

    const changeTodolistTitleHandler = (title: string) => {
        props.changeTodolistTitle(props.todolistId, title)
    }

    return <div className={s.Todos}>
        <h2>
            <AditableSpan value={props.todolist.title} changeTitle={changeTodolistTitleHandler}/>
            <button onClick={onClickButtonHandler}>-</button>
        </h2>

        <AddItemForm buttonName={"add"} addItem={addTask}/>
        <ul>
        {props.tasks?.map(t => {
            const removeTaskHandler = () => {
                props.removeTask(props.todolistId, t.id)
            }
            const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
                props.changeTaskStatus(props.todolistId, t.id, e.currentTarget.checked)
            }
            const changeTaskTitle = (value: string) => {
                props.changeTasksTitle(props.todolistId, t.id, value)
            }
            return <li key={t.id}>
                <input type="checkbox" onChange={onChangeInputHandler} checked={t.status === TaskStatuses.Completed}/>
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

// type

export type TodolistPropsType = {
    todolist: InitialTodolistsStateType
    todolistId: string
    removeTodolist: (todolistId: string) => void
    tasks: TaskType[]
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolist: string, filter: FilterType) => void
    changeTaskStatus: (todolistId: string, taskId: string, checked: boolean) => void
    changeTasksTitle: (todolistId: string, taskId: string, value: string) => void
    changeTodolistTitle: (todolistId: string, value: string) => void
}
