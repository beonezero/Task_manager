import {Todolist} from "./components/Todolist";
import s from "./App.module.css"
import {AddItemForm} from "./components/AddItemForm";
import {useAppDispatch, useAppSelector} from "./store/store";
import {
    fetchTodolistsTC,
    FilterType
} from "./components/todolist-reducer";
import {useEffect} from "react";

export const App = () => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(store => store.todolist)
    const tasks = useAppSelector(store => store.task)

    const todolistId = "todolist4"
    const addTodolist = (title: string) => {
    }
    const removeTodolist = (todolistId: string) => {
    }
    const removeTask = (todolistId: string, taskId: string) => {
    }

    const changeFilter = (todolistId: string, filter: FilterType) => {
    }

    const changeTaskStatus = (todolistId: string, taskId: string, checked: boolean) => {
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

                }
                const changeTodolistTitle = (value: string) => {

                }

                const addTask = (title: string) => {
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

