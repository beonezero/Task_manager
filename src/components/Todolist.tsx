import {TaskType, TodolistType} from "../App";
import {AddItemForm} from "./AddItemForm";
import s from "./Todolist.module.css"

export const Todolist = (props: TodolistPropsType) => {

    return <div className={s.Todos}>
        <h2>{props.todolist.title}</h2>
        <AddItemForm buttonName={"add"}/>
        <ul>
        {props.tasks.map(t => {
            return <li>
                <input type="checkbox" checked={t.isDone}/>
                {t.title}
                <button>x</button>
            </li>
        })}
        </ul>
        <button>All</button>
        <button>Active</button>
        <button>Completed</button>
    </div>
}

export type TodolistPropsType = {
    todolist: TodolistType
    tasks: TaskType[]
}