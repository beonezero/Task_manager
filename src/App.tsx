import {Todolist} from "./components/Todolist";
import s from "./App.module.css"
import {AddItemForm} from "./components/AddItemForm";
import {useAppDispatch, useAppSelector} from "./store/store";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC, fetchTodolistsTC,
    FilterType,
    removeTodolistAC
} from "./components/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./components/task-reducer";
import {useEffect} from "react";

export const App = () => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(store => store.todolist)
    const tasks = useAppSelector(store => store.task)

    const todolistId = "todolist4"
    const addTodolist = (title: string) => {
        dispatch(addTodolistAC(title, todolistId))
    }
    const removeTodolist = (todolistId: string) => {
        console.log(todolistId)
        dispatch(removeTodolistAC(todolistId))
    }
    const removeTask = (todolistId: string, taskId: string) => {
        dispatch(removeTaskAC(todolistId, taskId))
    }

    const changeFilter = (todolistId: string, filter: FilterType) => {
        dispatch(changeFilterAC(todolistId, filter))
    }

    const changeTaskStatus = (todolistId: string, taskId: string, checked: boolean) => {
        dispatch(changeTaskStatusAC(todolistId, taskId, checked))
    }

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

    return <div className={s.App}>
        <div className={s.AddTask}>
            <h2>Add Task</h2>
            <AddItemForm buttonName={"+"} addItem={addTodolist} todolistId={todolistId}/>
        </div>
        <div className={s.Todolist}>
            {todolists.map(td => {
                let allTodolistTasks = tasks[td.id]
                const changeTasksTitle = (taskId: string, value: string) => {
                    dispatch(changeTaskTitleAC(td.id, taskId, value))
                }
                const changeTodolistTitle = (value: string) => {
                    dispatch(changeTodolistTitleAC(td.id, value))
                }

                const addTask = (title: string) => {
                    dispatch(addTaskAC(td.id, title))
                }
                return <Todolist key={td.id}
                                 todolist={td}
                                 todolistId={td.id}
                                 removeTodolist={removeTodolist}
                                 tasks={allTodolistTasks}
                                 addTask={addTask}
                                 removeTask={removeTask}
                                 changeFilter={changeFilter}
                                 changeTaskStatus={changeTaskStatus}
                                 changeTasksTitle={changeTasksTitle}
                                 changeTodolistTitle = {changeTodolistTitle}
                />
            })}
        </div>
    </div>

}

// types
