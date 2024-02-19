import React, { useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import { AppRootStateType } from "app/store"
import { FilterValuesType, TodolistDomainType, todolistsActions, todolistsThunks } from "./todolists-reducer"
import { TasksStateType, tasksThunks } from "./tasks-reducer"
import { TaskStatuses } from "api/todolists-api"
import { Grid, Paper } from "@mui/material"
import { AddItemForm } from "components/AddItemForm/AddItemForm"
import { Todolist } from "./Todolist/Todolist"
import { Navigate } from "react-router-dom"
import { useAppDispatch } from "hooks/useAppDispatch"

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks)
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    const thunk = todolistsThunks.fetchTodolists()
    dispatch(thunk)
      .unwrap()
      .then((res) => {
        res.todolists.forEach((td) => {
          dispatch(tasksThunks.fetchTasks(td.id))
        })
      })
  }, [])

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    const thunk = tasksThunks.removeTask({ todolistId, taskId })
    dispatch(thunk)
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    const thunk = tasksThunks.addTask({ todolistId, title })
    dispatch(thunk)
  }, [])

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    const thunk = tasksThunks.updateTask({
      todolistId,
      taskId,
      domainModel: { status: status ? TaskStatuses.Completed : TaskStatuses.New },
    })
    dispatch(thunk)
  }, [])

  const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
    const thunk = tasksThunks.updateTask({ todolistId, taskId, domainModel: { title } })
    dispatch(thunk)
  }, [])

  const changeFilter = useCallback(function (filter: FilterValuesType, todolistId: string) {
    const action = todolistsActions.changeFilter({ todolistId, filter })
    dispatch(action)
  }, [])

  const removeTodolist = useCallback(function (todolistId: string) {
    const thunk = todolistsThunks.removeTodolist(todolistId)
    dispatch(thunk)
  }, [])

  const changeTodolistTitle = useCallback(function (todolistId: string, title: string) {
    const thunk = todolistsThunks.changeTodolistTitle({ todolistId, title })
    dispatch(thunk)
  }, [])

  const addTodolist = useCallback(
    (title: string) => {
      const thunk = todolistsThunks.addTodolist(title)
      dispatch(thunk)
    },
    [dispatch],
  )

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
