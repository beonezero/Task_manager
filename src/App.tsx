import {Todolist} from "./components/Todolist";
import s from "./App.module.css"
import {AddItemForm} from "./components/AddItemForm";
import {useAppDispatch, useAppSelector} from "./store/store";
import {
    addTodolistTC,
    fetchTodolistsTC,
    FilterType, removeTodolistTC, updateTodolistTC
} from "./components/todolist-reducer";
import {useEffect} from "react";
import {createTaskTC, deleteTaskTC} from "./components/task-reducer";

export const App = () => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(store => store.todolist)
    const tasks = useAppSelector(store => store.task)

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
    }

    const changeTaskStatus = (todolistId: string, taskId: string, checked: boolean) => {
    }

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    },[])

    return <div className={s.App}>
        <div className={s.AddTask}>
            <h2>Add Task</h2>
            <AddItemForm buttonName={"+"} addItem={addTodolist}/>
        </div>
        <div className={s.Todolist}>
            {todolists.map(td => {
                let allTodolistTasks = tasks[td.id]
                const changeTasksTitle = (taskId: string, value: string) => {

                }
                const changeTodolistTitle = (value: string) => {
                    dispatch(updateTodolistTC(td.id, value))
                }
                return <Todolist key={td.id}
                                 todolist={td}
                                 todolistId={td.id}
                                 removeTodolist={removeTodolist}
                                 tasks={allTodolistTasks}
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

