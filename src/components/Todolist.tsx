import {AddItemForm} from "./AddItemForm";
import s from "./Todolist.module.css"
import {FilterType, InitialTodolistsStateType} from "./todolist-reducer";
import {TaskType} from "./task-reducer";

export const Todolist = (props: TodolistPropsType) => {

    const onClickButtonHandler = () => {
        props.removeTodolist(props.todolistId)
    }

    const onAllClickHandler = () => {props.changeFilter(props.todolistId, "all")}
    const onActiveClickHandler = () => {props.changeFilter(props.todolistId, "active")}
    const onCompletedClickHandler = () => {props.changeFilter(props.todolistId, "completed")}

    return <div className={s.Todos}>
        <h2>
            {props.todolist.title}
            <button onClick={onClickButtonHandler}>-</button>
        </h2>

        <AddItemForm buttonName={"add"} addItem={props.addTask} todolistId={props.todolistId}/>
        <ul>
        {props.tasks.map(t => {
            const removeTaskHandler = () => {
                props.removeTask(props.todolistId, t.id)
            }
            return <li>
                <input type="checkbox" checked={t.isDone}/>
                {t.title}
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
    addTask: (todolistId: string, title: string) => void
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolist: string, filter: FilterType) => void
}
