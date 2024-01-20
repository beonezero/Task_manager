import {useAppDispatch, useAppSelector} from "../../App/store";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    fetchTodolistsTC,
    FilterType,
    removeTodolistTC,
    updateTodolistTC
} from "./todolist-reducer";
import {deleteTaskTC, updateTaskTC} from "./task-reducer";
import {TaskStatuses} from "../../api/todolist-api";
import {useEffect} from "react";
import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "../../components/Todolist";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

export const TodolistList = () => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(store => store.todolists)
    const tasks = useAppSelector(store => store.tasks)

    const addTodolist = (title: string) => {
        dispatch(addTodolistTC(title))
    }
    const removeTodolist = (todolistId: string) => {
        dispatch(removeTodolistTC(todolistId))
    }
    const removeTask = (todolistId: string, taskId: string) => {
        dispatch(deleteTaskTC(todolistId, taskId))
    }

    const changeFilter = (todolistId: string, filter: FilterType) => {
        dispatch(changeTodolistFilterAC(todolistId, filter))
    }

    const changeTaskStatus = (todolistId: string, taskId: string, checked: boolean) => {
        let status = checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskTC(todolistId, taskId, {status}))
    }

    const changeTasksTitle = (todolistId: string, taskId: string, title: string) => {
        dispatch(updateTaskTC(todolistId, taskId, {title}))
    }
    const changeTodolistTitle = (todolistId: string, value: string) => {
        dispatch(updateTodolistTC(todolistId, value))
    }

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [dispatch])

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {todolists.map(td => {
                let allTodolistTasks = tasks[td.id]

                return <Grid item key={td.id}>
                    <Paper style={{padding: '10px'}}>
                        <Todolist
                            todolist={td}
                            todolistId={td.id}
                            removeTodolist={removeTodolist}
                            tasks={allTodolistTasks}
                            removeTask={removeTask}
                            changeFilter={changeFilter}
                            changeTaskStatus={changeTaskStatus}
                            changeTasksTitle={changeTasksTitle}
                            changeTodolistTitle={changeTodolistTitle}
                        />
                    </Paper>
                </Grid>
            })}
        </Grid>
    </>
}
