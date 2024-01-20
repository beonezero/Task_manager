import React, {ChangeEvent} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {AditableSpan} from "../../../components/AditableSpan";
import {Delete} from "@mui/icons-material";

export const Task = (props: TaskPropsType) => {
    return <div>{props.tasks.map(t => {
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
            <Checkbox
                checked={t.status === TaskStatuses.Completed}
                color="primary"
                onChange={onChangeInputHandler}
            />
            <AditableSpan value={t.title} changeTitle={changeTaskTitle}/>
            <IconButton onClick={removeTaskHandler}>
                <Delete/>
            </IconButton>
        </li>
    })}
    </div>
};

//types

type TaskPropsType = {
    todolistId: string
    tasks: TaskType[]
    removeTask: (todolistId: string, taskId: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, checked: boolean) => void
    changeTasksTitle: (todolistId: string, taskId: string, value: string) => void
}