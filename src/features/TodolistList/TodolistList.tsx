import React from "react"
import { useAppDispatch, useAppSelector } from "App/store"
import {
  addTodolistTC,
  changeTodolistFilter,
  fetchTodolistsTC,
  FilterType,
  removeTodolistTC,
  updateTodolistTC,
} from "./todolist-reducer"
import { tasksThunks, updateTaskTC } from "./task-reducer"
import { TaskStatuses } from "api/todolist-api"
import { useEffect } from "react"
import { AddItemForm } from "components/AddItemForm"
import { Todolist } from "./Todolist/Todolist"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { Navigate } from "react-router-dom"

export const TodolistList = React.memo(() => {
  const dispatch = useAppDispatch()
  const todolists = useAppSelector((store) => store.todolists)
  const tasks = useAppSelector((store) => store.tasks)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  const addTodolist = (title: string) => {
    dispatch(addTodolistTC(title))
  }
  const removeTodolist = (todolistId: string) => {
    dispatch(removeTodolistTC(todolistId))
  }
  const removeTask = (todolistId: string, taskId: string) => {
    dispatch(tasksThunks.deleteTask({ todolistId, taskId }))
  }

  const changeFilter = (todolistId: string, filter: FilterType) => {
    dispatch(changeTodolistFilter({ todolistId: todolistId, filter: filter }))
  }

  const changeTaskStatus = (todolistId: string, taskId: string, checked: boolean) => {
    let status = checked ? TaskStatuses.Completed : TaskStatuses.New
    dispatch(updateTaskTC(todolistId, taskId, { status }))
  }

  const changeTasksTitle = (todolistId: string, taskId: string, title: string) => {
    dispatch(updateTaskTC(todolistId, taskId, { title }))
  }
  const changeTodolistTitle = (todolistId: string, value: string) => {
    dispatch(updateTodolistTC(todolistId, value))
  }

  useEffect(() => {
    dispatch(fetchTodolistsTC())
  }, [dispatch])

  if (!isLoggedIn) {
    return <Navigate to={"login"} />
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((td) => {
          let allTodolistTasks = tasks[td.id]

          return (
            <Grid item key={td.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={td}
                  todolistId={td.id}
                  removeTodolist={removeTodolist}
                  tasks={allTodolistTasks}
                  entityStatus={td.entityStatus}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  changeTaskStatus={changeTaskStatus}
                  changeTasksTitle={changeTasksTitle}
                  changeTodolistTitle={changeTodolistTitle}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
})
