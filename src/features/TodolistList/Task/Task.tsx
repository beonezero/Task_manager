import React, { ChangeEvent } from "react"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import { TaskStatuses, TaskType } from "api/todolist-api"
import { AditableSpan } from "components/AditableSpan"
import Delete from "@mui/icons-material/Delete"

export const Task = React.memo((props: TaskPropsType) => {
  const removeTaskHandler = () => {
    props.removeTask(props.todolistId, props.task.id)
  }
  const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    props.changeTaskStatus(props.todolistId, props.task.id, e.currentTarget.checked)
  }
  const changeTaskTitle = (value: string) => {
    props.changeTasksTitle(props.todolistId, props.task.id, value)
  }
  return (
    <div>
      <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={onChangeInputHandler}
      />
      <AditableSpan value={props.task.title} changeTitle={changeTaskTitle} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  )
})

//types

type TaskPropsType = {
  todolistId: string
  task: TaskType
  removeTask: (todolistId: string, taskId: string) => void
  changeTaskStatus: (todolistId: string, taskId: string, checked: boolean) => void
  changeTasksTitle: (todolistId: string, taskId: string, value: string) => void
}
