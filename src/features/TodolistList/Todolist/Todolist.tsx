import {AddItemForm} from "../../../components/AddItemForm";
import {FilterType, TodolistDomainType} from "../todolist-reducer";
import {useEffect} from "react";
import {AditableSpan} from "../../../components/AditableSpan";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {createTaskTC, fetchTasksTC} from "../task-reducer";
import {useAppDispatch} from "../../../App/store";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {Task} from "../Task/Task";
import {RequestStatusType} from "../../../App/app-reducer";

export const Todolist = (props: TodolistPropsType) => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchTasksTC(props.todolistId))
    }, [props.todolistId, dispatch])

    const onClickButtonHandler = () => {
        props.removeTodolist(props.todolistId)
    }

    const onAllClickHandler = () => {
        props.changeFilter(props.todolistId, "all")
    }
    const onActiveClickHandler = () => {
        props.changeFilter(props.todolistId, "active")
    }
    const onCompletedClickHandler = () => {
        props.changeFilter(props.todolistId, "completed")
    }

    const addTask = (title: string) => {
        dispatch(createTaskTC(props.todolistId, title))
    }

    const changeTodolistTitleHandler = (title: string) => {
        props.changeTodolistTitle(props.todolistId, title)
    }

    let tasksForTodolist = props.tasks

    if (props.todolist.filter === "active") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }

    if (props.todolist.filter === "completed") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }


    return <div>
        <h2>
            <AditableSpan value={props.todolist.title} changeTitle={changeTodolistTitleHandler}/>
            <IconButton onClick={onClickButtonHandler} disabled={props.entityStatus === "loading"}>
                <Delete/>
            </IconButton>
        </h2>

        <AddItemForm addItem={addTask} disabled={props.entityStatus === "loading"}/>
        <div>
            {tasksForTodolist?.map(task => {
                return <Task key={task.id}
                             task={task}
                             todolistId={props.todolistId}
                             changeTaskStatus={props.changeTaskStatus}
                             changeTasksTitle={props.changeTasksTitle}
                             removeTask={props.removeTask}
                />
            })}
        </div>
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
    entityStatus: RequestStatusType
    todolistId: string
    removeTodolist: (todolistId: string) => void
    tasks: TaskType[]
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolist: string, filter: FilterType) => void
    changeTaskStatus: (todolistId: string, taskId: string, checked: boolean) => void
    changeTasksTitle: (todolistId: string, taskId: string, value: string) => void
    changeTodolistTitle: (todolistId: string, value: string) => void
}
