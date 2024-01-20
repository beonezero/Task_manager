import {AddItemForm} from "./AddItemForm";
import {FilterType, TodolistDomainType} from "../features/TodolistList/todolist-reducer";
import {useEffect} from "react";
import {AditableSpan} from "./AditableSpan";
import {TaskStatuses, TaskType} from "../api/todolist-api";
import {createTaskTC, fetchTasksTC} from "../features/TodolistList/task-reducer";
import {useAppDispatch} from "../store/store";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "../features/TodolistList/Task/Task";

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

    let tasksForTodolist = props.tasks

    if (props.todolist.filter === "active"){
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }

    if (props.todolist.filter === "completed"){
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }


    return <div>
        <h2>
            <AditableSpan value={props.todolist.title} changeTitle={changeTodolistTitleHandler}/>
            <IconButton onClick={onClickButtonHandler}>
                <Delete/>
            </IconButton>
        </h2>

        <AddItemForm addItem={addTask}/>
        <ul>
            <Task tasks={tasksForTodolist}
                  todolistId={props.todolistId}
                  changeTaskStatus={props.changeTaskStatus}
                  changeTasksTitle={props.changeTasksTitle}
                  removeTask={props.removeTask}
            />
        </ul>
        <div style={{paddingTop: '10px'}}>
            <Button variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
}

// type

export type TodolistPropsType = {
    todolist: TodolistDomainType
    todolistId: string
    removeTodolist: (todolistId: string) => void
    tasks: TaskType[]
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolist: string, filter: FilterType) => void
    changeTaskStatus: (todolistId: string, taskId: string, checked: boolean) => void
    changeTasksTitle: (todolistId: string, taskId: string, value: string) => void
    changeTodolistTitle: (todolistId: string, value: string) => void
}
