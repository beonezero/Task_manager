import {TaskType} from "../App";
import {AddItemForm} from "./AddItemForm";
import s from "./Todolist.module.css"
import {InitialTodolistsStateType} from "./Todolist-reducer";

export const Todolist = (props: TodolistPropsType) => {

    const onClickButtonHandler = () => {
        props.removeTodolist(props.todolistId)
    }

    return <div className={s.Todos}>
        <h2>
            {props.todolist.title}
            <button onClick={onClickButtonHandler}>-</button>
        </h2>

        <AddItemForm buttonName={"add"} addItem={() => {}}/>
        <ul>
        {/*{props.tasks.map(t => {*/}
        {/*    return <li>*/}
        {/*        <input type="checkbox" checked={t.isDone}/>*/}
        {/*        {t.title}*/}
        {/*        <button>x</button>*/}
        {/*    </li>*/}
        {/*})}*/}
        </ul>
        <button>All</button>
        <button>Active</button>
        <button>Completed</button>
    </div>
}

export type TodolistPropsType = {
    todolist: InitialTodolistsStateType
    todolistId: string
    removeTodolist: (todolistId: string) => void
    // tasks: TaskType[]
}